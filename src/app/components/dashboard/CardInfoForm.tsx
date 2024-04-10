import React from 'react';

interface CardInfoFormProps {
    cardInfo: any;
    setCardInfo: (cardInfo: any) => void;
    from: "PROFILE" | "PAYMENT";

}
function CardInfoForm(props: CardInfoFormProps) {
    const {cardInfo, setCardInfo, from} = props;

    function handleExpirationChange(e: React.ChangeEvent<HTMLInputElement>, setCardInfo: any, cardInfo: any) {
        const input = e.target.value;
        // Normalize the input to ensure it only contains numbers and remove any non-numeric characters
        const numbers = input.replace(/[^\d]/g, '');

        // Insert "/" after 2 digits but only if more than 2 digits are entered
        const formattedValue = numbers.length > 2 ? `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}` : numbers;

        // Update state if the formatted value is valid (max 5 characters to accommodate MM/YY)
        if (formattedValue.length <= 5) {
            setCardInfo({ ...cardInfo, exp_date: formattedValue });
        }
    }

    function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>, setCardInfo: any, cardInfo: any) {
        const input = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
        const formattedInput = input.match(/.{1,4}/g)?.join(' ') || ''; // Chunk into groups of 4 and join with space

        // Update state if the formatted value is valid (max 19 characters to accommodate 16 digits and 3 spaces)
        if (formattedInput.length <= 19) {
            setCardInfo({ ...cardInfo, number: formattedInput });
        }
    }


    return (
        <div className={"flex flex-col gap-3 text-slate-500 font-medium"}>
            <div className="flex flex-col gap-1">
                <label htmlFor="Card Number" className="">Card Number</label>
                <input
                    value={cardInfo.number || ""}
                    onChange={(e) => handleCardNumberChange(e, setCardInfo, cardInfo)}
                    placeholder={"0000 0000 0000 0000"}
                    type="text" id="card_number"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className={"flex flex-col sm:flex-row gap-5 "}>
                <div className="flex w-full flex-col gap-1">
                    <label htmlFor="Expiration Date" className="">Expiration Date</label>
                    <input
                        value={cardInfo.exp_date || ""}
                        onChange={(e) => handleExpirationChange(e, setCardInfo, cardInfo)}
                        type="text" id="expiration_date"
                        placeholder="MM/YY"
                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                </div>
                <div className="flex w-full flex-col gap-1">
                    <label htmlFor="CVC" className="">CVC{from === "PROFILE" ? ' (optional)' : ''}</label>
                    <input
                        value={cardInfo.cvc || ""}
                        onChange={(e) => {
                            const re = /^[0-9\b]{0,3}$/; // Regular expression to match numbers and backspace, and limit the length to 3
                            if (e.target.value === '' || re.test(e.target.value)) {
                                setCardInfo({...cardInfo, cvc: e.target.value})
                            }
                        }}
                        type="text" id="cvc"
                        className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
                </div>
            </div>
        </div>
    );
}

export default CardInfoForm;