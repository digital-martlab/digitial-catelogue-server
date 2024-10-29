import { LazyLoadImage } from "react-lazy-load-image-component";

function BenefitItem({ image, heading1, heading2, description, Content }) {
    return (
        <div className="md:flex flex-row-reverse even:flex-row justify-between items-center" aria-labelledby={`${heading2}-heading`}>
            <div className="md:max-w-[50%]">
                <LazyLoadImage src={image} alt={heading2} data-aos="fade-in" />
            </div>

            <div className="text-left md:max-w-[40%] mt-14 md:mt-0">
                <p className="font-semibold text-base" aria-hidden="true">{heading1}</p>
                <h1 id={`${heading2}-heading`} className="font-bold text-4xl leading-[60px]" data-aos="fade-right">
                    {heading2}
                </h1>
                <p className="my-4" aria-describedby={`${heading2}-description`}>
                    {description}
                </p>
                <Content />
            </div>
        </div>
    );
}

export default BenefitItem;
