import React, { useState } from "react";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionStatus("");

        // Simulate form submission
        try {
            // Here you would typically handle your form submission, e.g., sending to an API
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setSubmissionStatus("Thank you for your message! We'll get back to you soon.");
        } catch (error) {
            setSubmissionStatus("Sorry, there was an error submitting your form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="container mt-28">
            <h2 className="text-4xl font-bold text-center mb-8" data-aos="fade-up">
                Get in Touch with Us
            </h2>
            <div className="max-w-lg mx-auto p-8 rounded-lg shadow-lg bg-white">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-home"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-home"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700" htmlFor="message">
                            Message
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="5"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-home"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full p-3 text-white bg-home rounded-lg hover:bg-home-dark transition duration-300 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                </form>
                {submissionStatus && (
                    <div className="mt-4 text-center">
                        <p className={`text-lg ${submissionStatus.includes("error") ? "text-red-500" : "text-green-500"}`}>
                            {submissionStatus}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ContactUs;
