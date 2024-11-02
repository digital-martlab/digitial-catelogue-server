const createStoreWhatsAppMessage = (storeDetails, password) => {
    return `
* Welcome to Your New Store! *

Hello ${storeDetails.name},

We're excited to have you onboard! Here are the details for your newly created store:

*Store Information:*
- *Store Name:* ${storeDetails.store_name}
- *Store ID:* ${storeDetails.store_id}
- *Contact Number:* +91 ${storeDetails.number}
- *Email:* ${storeDetails.email}
- *Plan Expiration:* ${storeDetails.plan_expires_in}

*Login Details:*
- *Password:* ${password}

*Login Here:* https://cataloguewala.com/admin/login

For any assistance, feel free to reach out to our support team. 

Thank you for joining us, and we look forward to supporting your store's growth! 
    `.trim();
};


const createStoreHtmlEmailTemplate = (storeDetails, password) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Store Created Successfully</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #f9f9f9;
            }
            .header {
                background-color: #4CAF50;
                color: #fff;
                text-align: center;
                padding: 10px 0;
                border-radius: 8px 8px 0 0;
            }
            .header h1 {
                margin: 0;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin: 10px 0;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                color: #fff;
                background-color: #4CAF50;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 0.9em;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Catalogue Wala</h1>
            </div>
            <div class="content">
                <h2>Welcome to Your New Store!</h2>
                <p>Dear ${storeDetails.name},</p>
                <p>Your store <strong>${storeDetails.store_name}</strong> has been successfully created with the following details:</p>
                <table>
                    <tr><td><strong>Store Name:</strong></td><td>${storeDetails.store_name}</td></tr>
                    <tr><td><strong>Store ID:</strong></td><td>${storeDetails.store_id}</td></tr>
                    <tr><td><strong>Email:</strong></td><td>${storeDetails.email}</td></tr>
                    <tr><td><strong>Contact Number:</strong></td><td>${storeDetails.number}</td></tr>
                    <tr><td><strong>Plan Expiration:</strong></td><td>${storeDetails.plan_expires_in}</td></tr>
                </table>
                <p><strong>Login Password:</strong> ${password}</p>
                <p>You can access your store dashboard and manage your settings using the link below:</p>
                <a href="https://cataloguewala.com/admin/login" class="button">Login Now</a>
                <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Catalogue Wala. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};


module.exports = {
    createStoreHtmlEmailTemplate, createStoreWhatsAppMessage
}