const Razorpay = require('razorpay');
const catchAsyncHandler = require('../middlewares/catch-async-handler-middleware');
const ErrorCreator = require('../config/error-creator-config');
const { StatusCodes } = require('http-status-codes');
const { sqlQueryRunner } = require('../config/database');
const createResponse = require('../config/create-response-config');
const constantVariables = require('../config/constant-variables');
const { generateStoreID, expiryDateGenerator } = require('../config/generateStoreId');
const bcrypt = require('bcrypt');
const createSlug = require('../config/slug-creator-config');
const { createStoreHtmlEmailTemplate } = require('../templates/create-store-template');
const { transporter, mailOptions } = require('../config/email-config');
const crypto = require("crypto");

module.exports = {
    createStore: catchAsyncHandler(async (req, res, next) => {
        const razorpayInstance = new Razorpay({
            key_id: constantVariables.RAZORPAY_KEY_ID,
            key_secret: constantVariables.RAZORPAY_KEY_SECRET,
        });

        const {
            name,
            email,
            number,
            store_name,
            password,
            state,
            city,
            area,
            plan_id,
        } = req.body;

        if (
            !name ||
            !email ||
            !number ||
            !store_name ||
            !password ||
            !state ||
            !city ||
            !area ||
            !plan_id
        ) {
            next(new ErrorCreator(StatusCodes.BAD_REQUEST, "All fields are required"));
        }

        const slug = createSlug(store_name);


        const existingStoreQuery = "SELECT * FROM stores WHERE email = ? OR store_slug = ?";
        const existingStore = await sqlQueryRunner(existingStoreQuery, [email, slug]);
        if (existingStore.length > 0) {
            next(new ErrorCreator(StatusCodes.CONFLICT, "Email or Store Name already exists."));
        }

        const planQuery = "SELECT * FROM plans WHERE plan_id = ?";
        const planData = await sqlQueryRunner(planQuery, [plan_id]);
        if (planData.length === 0) {
            next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Invalid plan_id provided."));
        }

        const planAmount = planData[0]?.plan_price * 100;
        const planExpiresIn = expiryDateGenerator(planData[0]?.plan_duration_months);

        let razorpayOrder;
        try {
            razorpayOrder = await razorpayInstance.orders.create({
                amount: planAmount,
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
                notes: {
                    store_name,
                    email,
                    plan_id,
                },
            });
        } catch (err) {
            next(new ErrorCreator(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create Razorpay order."));
        }

        const hashedPassword = await bcrypt.hash(password, constantVariables.SALT);

        const insertStoreQuery = `
            INSERT INTO stores 
            (name, email, number, store_name, store_slug, store_id, password, plan_expires_in, 
            state, city, area, plan_id, order_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        let insertedStore = await sqlQueryRunner(insertStoreQuery, [
            name,
            email,
            number,
            store_name,
            slug,
            generateStoreID(),
            hashedPassword,
            planExpiresIn,
            state,
            city,
            area,
            plan_id,
            razorpayOrder.id,
        ]);

        const themeQuery = "INSERT INTO theme (acc_id) VALUES (?)";
        await sqlQueryRunner(themeQuery, [insertedStore?.insertId]);

        const data = await sqlQueryRunner('SELECT * FROM stores WHERE order_id = ?', [razorpayOrder.id]);
        const store = data[0];

        const subject = "Welcome to Catalogue Wala! Your New Store is Ready";
        const emailContent = createStoreHtmlEmailTemplate(store);
        await transporter.sendMail(mailOptions(store.email, subject, emailContent));

        return createResponse(res, StatusCodes.CREATED, "Order Created Successfully", {
            razorpayOrder,
            storeId: insertedStore.insertId,
            paymentData: {
                key: constantVariables.RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: store_name,
                description: `Purchase plan: ${planData[0]?.plan_type}`,
                order_id: razorpayOrder.id,
                prefill: {
                    name,
                    email,
                    contact: number,
                },
                notes: razorpayOrder.notes,
                theme: {
                    color: "#169285",
                },
            },
        });
    }),

    paymentVerfication: catchAsyncHandler(async (req, res, next) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', constantVariables.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature)
            next(new ErrorCreator(StatusCodes.BAD_REQUEST, "Payment is invalid."))

        await sqlQueryRunner(`UPDATE stores SET paid_status = "PAID" WHERE order_id = ?`, [razorpay_order_id]);
        return createResponse(res, StatusCodes.CREATED, "Payment successful! The store information has been sent to your email.")
    })
};
