import BenefitItem from "@/components/Home/benefit-item";
import CheckedItem from "@/components/Home/checked-item";
import ContactUs from "@/components/Home/contact-us";
import Feature from "@/components/Home/feature-items";
import Aos from "aos";
import "aos/dist/aos.css";
import { ArrowBigUp, Mail, Menu, Palette, PhoneCall, PlayIcon, Smartphone, Store, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

export default function Home() {
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        Aos.init({
            once: true
        });
        Aos.refresh();
    }, []);

    const toggleMobileNav = () => {
        setMobileNavOpen(prev => !prev);
    };

    return (
        <div id="header" className="text-[rgb(34,52,61)] bg-white">
            {/* Header */}
            <header
                className="md:container flex justify-between shadow-md md:shadow-none h-20 px-4 items-center sticky top-0 bg-white z-50 animate-in fade-in"
                aria-label="Main navigation header"
            >
                <a href={"#header"} className="text-3xl md:text-4xl font-bold h-full py-4" aria-label="Go to homepage">
                    <LazyLoadImage src="./images/logo.webp" alt="CatalogueWala" width={100} height={54} />
                </a>
                <div className="hidden md:flex gap-4" role="navigation" aria-label="Primary navigation">
                    <a href={"#header"} className="nav-item">Home</a>
                    <a href={"#features"} className="nav-item">Features</a>
                    <a href={"#benefits"} className="nav-item">Benefits</a>
                    {/* Uncomment these links if needed
        <a href={"#price"} className="nav-item">Price</a>
        <a href={"#testimonial"} className="nav-item">Testimonials</a>
        */}
                </div>
                <a href="#contact-us" className="home-button hidden md:block" aria-label="Contact us">Contact Us</a>
                {/* Mobile Menu Button */}
                <button onClick={toggleMobileNav} className="md:hidden" aria-label={isMobileNavOpen ? "Close mobile navigation" : "Open mobile navigation"}>
                    {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                {isMobileNavOpen && (
                    <nav className="md:hidden bg-white shadow-md p-4 absolute w-full left-0 top-16 z-50 animate-in fade-in" aria-label="Mobile navigation">
                        <a href={"#header"} className="block py-2">Home</a>
                        <a href={"#features"} className="block py-2">Features</a>
                        <a href={"#benefits"} className="block py-2">Benefits</a>
                        <a href={"#contact-us"} className="block py-2" aria-label="Contact us">Contact Us</a>
                        {/* Uncomment these links if needed
            <a href={"#price"} className="block py-2">Price</a>
            <a href={"#testimonial"} className="block py-2">Testimonials</a>
            */}
                    </nav>
                )}
            </header>

            <section
                className="container mt-4 md:flex flex-row-reverse justify-between items-center text-[#22343D] aspect-video"
                aria-labelledby="store-creation-heading"
            >
                <div className="md:max-w-[50%]">
                    <LazyLoadImage
                        src="./images/amico.svg"
                        alt="Illustration representing online store creation"
                        data-aos="fade-down"
                        width={700}
                        height={700}
                    />
                </div>

                {/* text section */}
                <div className="text-center sm:text-left md:max-w-[40%]">
                    <h1
                        id="store-creation-heading"
                        className="font-bold text-4xl leading-[60px]"
                        data-aos="fade-down"
                    >
                        Effortless Online Store Creation for Small Businesses!
                    </h1>
                    <p
                        className="mt-4 text-[18px] leading-[28px] font-normal"
                        data-aos="fade-down"
                        aria-describedby="store-description"
                    >
                        With CatalogueWala, get your store online in just one click—no coding needed, all products directly connected to WhatsApp for easy management and quick orders.
                    </p>
                    <div
                        className="mt-8 flex items-center justify-around sm:justify-start sm:space-x-8"
                        data-aos="fade-down"
                    >
                        <a href="#contact-us" className="home-button" aria-label="Get started with CatalogueWala">Get Started</a>
                        <Link
                            to="https://youtu.be/Ukwbw_Pl_zM?si=AxsqGnZYoowRxWa6"
                            target="_blank"
                            className="font-semibold text-home whitespace-nowrap flex items-center underline hover:scale-110 active:scale-95 duration-200 cursor-pointer"
                            aria-label="Watch the introductory video about CatalogueWala"
                        >
                            <PlayIcon className="h-8" />
                            Watch the Video
                        </Link>
                    </div>
                </div>
            </section>


            <section id="features" className="container pt-24 flex flex-col items-center">
                <h2 className="text-[32px] font-bold text-center sm:text-left" data-aos="fade-up">
                    Product was Built Specifically for You
                </h2>

                <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    <Feature
                        Icon={ArrowBigUp}
                        title="Quick Store Setup"
                        iconBgColor="#02897A"
                        description="Create a professional online store in just one click. No coding required!"
                    />
                    <Feature
                        Icon={Store}
                        iconBgColor="#4D8DFF"
                        title="Product & Category Management"
                        description="Easily organize and manage your products and categories with an intuitive dashboard."
                    />
                    <Feature
                        Icon={Smartphone}
                        iconBgColor="#740A76"
                        title="WhatsApp Integration"
                        description="Orders are sent directly to your WhatsApp for quick processing and communication with customers."
                    />
                    <Feature
                        Icon={Palette}
                        iconBgColor="#F03E3D"
                        title="Theme Customization"
                        description="Choose from a range of themes to match your brand’s look and feel. Switch themes anytime as your business evolves."
                    />
                </div>
            </section>

            <section id="benefits" className="container pt-24 space-y-24">
                <BenefitItem
                    image="./images/benefit-1.svg"
                    heading1="Effortless Product"
                    heading2="Management"
                    description="Easily manage your entire catalog with no technical hassle. Add products, update categories, and apply coupons with just a few clicks."
                    Content={() => (
                        <div>
                            <h4 className="mt-6 mb-2 font-semibold">Organize & Update</h4>
                            <p>
                                Instantly upload and organize your products into categories and make quick edits whenever you need.
                            </p>
                            <h5 className="mt-6 mb-2 font-semibold">Coupon Creation</h5>
                            <p>
                                Create custom discount coupons to engage customers and drive sales.
                            </p>
                        </div>
                    )}
                />

                <BenefitItem
                    image="./images/benefit-2.svg"
                    heading1="Seamless"
                    heading2="Customer Communication"
                    description="Stay directly connected with your customers—every order goes straight to your WhatsApp for easy management and fast responses."
                    Content={() => (
                        <div className="flex flex-col space-y-6">
                            <CheckedItem
                                bgColor="#FF9900"
                                text="Instantly receive orders and inquiries on WhatsApp."
                            />
                            <CheckedItem
                                bgColor="#F03E3D"
                                text="Communicate directly with customers to confirm orders and answer questions."
                            />
                            <CheckedItem
                                bgColor="#4D8DFF"
                                text="Get a personal touch in every customer interaction for a better shopping experience."
                            />
                        </div>
                    )}
                />

                <BenefitItem
                    image="./images/benefit-3.svg"
                    heading1="Customizable Store"
                    heading2="Appearance"
                    description="Build a store that reflects your brand. Choose from a variety of themes and customize your look to stand out from the crowd."
                    Content={() => (
                        <div>
                            <h4 className="mt-6 mb-2 font-semibold">Theme Selection</h4>
                            <p>
                                Pick a theme that matches your style, and switch themes anytime as your brand evolves.
                            </p>
                            <h5 className="mt-6 mb-2 font-semibold">Personalized Branding</h5>
                            <p>
                                Customize colors, fonts, and layouts to make your store uniquely yours.
                            </p>
                        </div>
                    )}
                />
            </section>
            {/* 
            <div className="md:flex flex-row-reverse even:flex-row justify-between items-center">
                <PriceCard
                    title="Yearly Plan"
                    description="Brief price description"
                    price="4500"
                    features={[
                        "Theme Customization",
                        "WhatsApp Integration",
                        "Product Management",
                        "Category Creation",
                        "Coupon Management",
                    ]}
                />

                <div className="text-left md:max-w-[40%] mt-14 md:mt-0">
                    <p className="font-semibold text-base">Lorem ipsum dolor</p>
                    <h1 className="font-bold text-4xl leading-[60px]" data-aos="fade-right">asdfsadfs</h1>
                    <p className="my-4"> sit amet consectetur adipisicing elit. Magni officia in totam voluptate, esse mollitia commodi aliquid inventore eligendi nesciunt eos enim est nisi optio velit ducimus facere quidem laudantium!</p>
                    <Content />
                </div>
            </div> */}

            {/* <section id="price" className="container mt-28 text-center" data-aos="fade-up">
                <h3 className="text-[32px] font-bold">Plan</h3>
                <p className="font-medium">We offer competitive price</p>

                <div className="mt-11 grid gap-8 md:gap-5 md:grid-cols-3 lg:gap-8 xl:gap-16 justify-center">
                    <span></span>
                    <PriceCard
                        title="Yearly Plan"
                        description="Brief price description"
                        price="4500"
                        features={[
                            "Theme Customization",
                            "WhatsApp Integration",
                            "Product Management",
                            "Category Creation",
                            "Coupon Management",
                        ]}
                    />
                    <span></span>
                    <PriceCard
                        title="Standard"
                        description="Brief price description"
                        price="5"
                        operators="5+"
                    />
                    <PriceCard
                        title="Premium"
                        description="Brief price description"
                        price="10"
                        operators="10+"
                    />
                </div>
            </section> */}

            {/* <section id="testimonials" className="container mt-36 text-center flex flex-col items-center" data-aos="fade-right">
                <h3 className="text-4xl font-bold">What Clients Say</h3>
                <p className="font-medium max-w-lg">
                    Trusted by Small Business Owners Everywhere
                </p>

                <div className="mt-12 min-w-[80vw] justify-center md:gap-4 md:min-w-full grid gap-8 md:grid-cols-3">
                    <TestimonialItem
                        name="Ramesh"
                        designation="Ramesh’s Boutique"
                        userImg="./images/user-1.jpg"
                        rating={4}
                        testimonial={"CatalogueWala made it so easy to set up my store. I can now manage all my products and get orders directly on WhatsApp!"}
                    />
                    <TestimonialItem
                        name="Priya"
                        designation="Handmade Treasures"
                        userImg="./images/user-2.jpg"
                        rating={3}
                        testimonial={"The one-click setup is a game-changer. I set up my store, customized it to match my brand, and was ready to sell in under 10 minutes!"}
                    />
                    <TestimonialItem
                        name="Amy Adams"
                        designation="Photographer"
                        userImg="./images/user-3.jpg"
                        rating={4}
                        testimonial={testimonial}
                    />
                </div>
            </section> */}

            <ContactUs />


            <footer className="mt-24 pt-12 pb-8 bg-gray-900 text-gray-300" aria-label="Footer">
                <div className="container mx-auto px-6 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 text-center sm:text-left">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center sm:items-start lg:col-span-2">
                        <a href="#header" className="text-3xl font-bold mb-4" aria-label="Go to homepage">
                            Catalogue<span className="text-home">Wala</span>
                        </a>
                        <p className="text-sm leading-relaxed">
                            CatalogueWala is designed to help small businesses set up an online store quickly and manage orders directly via WhatsApp. With customizable themes and seamless product management, you can provide your customers a professional shopping experience, effortlessly.
                        </p>
                    </div>

                    {/* Resources Section */}
                    <div>
                        <p className="font-semibold text-lg mb-4">Resources</p>
                        <a className="block mb-2 hover:text-gray-400" href="#header" aria-label="Navigate to Home">Home</a>
                        <a className="block mb-2 hover:text-gray-400" href="#features" aria-label="Navigate to Features">Features</a>
                        <a className="block mb-2 hover:text-gray-400" href="#benefits" aria-label="Navigate to Benefits">Benefits</a>
                        <a className="block mb-2 hover:text-gray-400" href="#price" aria-label="Navigate to Price">Price</a>
                    </div>

                    {/* About Us Section */}
                    <div>
                        <p className="font-semibold text-lg mb-4">About Us</p>
                        <a className="block mb-2 hover:text-gray-400" href="#privacy" aria-label="View Privacy Policy">Privacy Policy</a>
                        <a className="block mb-2 hover:text-gray-400" href="#terms" aria-label="View Terms of Service">Terms of Service</a>
                        <a className="block mb-2 hover:text-gray-400" href="#contact" aria-label="Contact Us">Contact Us</a>
                    </div>

                    {/* Contact Us Section */}
                    <div>
                        <p className="font-semibold text-lg mb-4">Contact Us</p>
                        <a className="mb-2 flex items-center justify-center sm:justify-start hover:text-gray-400" href="mailto:info@digitalmartlab.com" aria-label="Email us at info@digitalmartlab.com">
                            <Mail className="mr-2" /> info@digitalmartlab.com
                        </a>
                        <a className="mb-2 flex items-center justify-center sm:justify-start hover:text-gray-400" href="tel:+918299207159" aria-label="Call us at +91 82992 07159">
                            <PhoneCall className="mr-2" /> +91 82992 07159
                        </a>

                        {/* Social Media Links */}
                        <div className="mt-4 flex justify-center sm:justify-start space-x-4">
                            <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/digitalmartlab.in" className="hover:text-gray-400" aria-label="Visit our Facebook page">
                                <LazyLoadImage className="h-6 w-6" src="./images/fb-icon.svg" alt="Facebook" />
                            </a>
                            <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/digital_mart_lab/" className="hover:text-gray-400" aria-label="Visit our Instagram profile">
                                <LazyLoadImage className="h-6 w-6" src="./images/insta-icon.svg" alt="Instagram" />
                            </a>
                            <a target="_blank" rel="noopener noreferrer" href="https://x.com/DigitalMartLab" className="hover:text-gray-400" aria-label="Visit our Twitter profile">
                                <LazyLoadImage className="h-6 w-6" src="./images/twitter-icon.svg" alt="Twitter" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Section */}
                <a href="https://digitalmartlab.in/" className="block mt-8 text-center text-gray-500 text-xs" aria-label="Visit Digital Mart Lab">
                    © {new Date().getFullYear()} CatalogueWala. All rights reserved.
                </a>
            </footer>
        </div>
    )
}