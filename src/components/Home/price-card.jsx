import { currencyIcon } from "@/lib/constants";
import { CheckCircle } from "lucide-react";

function PriceCard({ title, description, price, features }) {
    return (
        <div className="border min-w-[80vw] sm:min-w-[400px] md:min-w-full group even:bg-home even:text-white flex flex-col items-center rounded-xl shadow-borderShadow p-6">
            <h4 className="mt-6 font-bold text-2xl text-center">{title}</h4>
            <p className="mt-2 text-center">{description}</p>

            <div className="mt-6 flex items-center">
                <p className="text-7xl text-home group-even:text-white font-bold">{price}</p>
                <div className="ml-2 flex flex-col items-start">
                    <p className="text-home group-even:text-white font-bold text-2xl">{currencyIcon}</p>
                    <p className="text-[#AFAFAF] group-even:text-[#E0E0E0] -mt-1">Per / year</p>
                </div>
            </div>

            <div className="mt-5 text-left">
                <h5 className="font-semibold text-lg mt-4 text-center">Features</h5>
                {features?.map((feature, index) => (
                    <p key={index} className="mt-2 flex items-center gap-2">
                        <CheckCircle />
                        {feature}
                    </p>
                ))}
            </div>

            <button className="home-button mt-9 mb-8 group-even:home-button-white rounded-lg transition duration-200 hover:bg-opacity-80">
                Order Now
            </button>
        </div>
    );
}

export default PriceCard;
