import React, {useEffect, useState} from "react";
import {Bars} from "react-loader-spinner";
import axios from "axios";
import { getDoc } from "firebase/firestore";

function PaymentReportBox(props) {
    const [displayValue, setDisplayValue] = useState("none");
    const [loading, setLoading] = useState(false);
    const [discount, setDiscount] = useState({
        code: "NONE",
        appliesTo: [],
        discountType: "price",
        discount: 0
    });
    const [tinkeringActivityData, setTinkeringActivityData] = useState({});
    const [tinkeringActivityAmount, setTinkeringActivityAmount] = useState(0);

    function handleMouseOver(event) {
        setDisplayValue("block");
    }

    function handleMouseOut(event) {
        setDisplayValue("none");
    }

    useEffect(() => {
        if (props.showWhat === "currentPayments") {
            if (props.data.type === "tinkeringActivity") {
                setTinkeringActivityAmount(props.data.paymentInfo.amount);
            }
        }
        else if (props.showWhat === "paymentsHistory") {
            if (props.data.type === "tinkeringActivity") {
                const tinkeringActivityDoc = props.data.doc;
                (async () => {
                    const taData = await getDoc(tinkeringActivityDoc);
                    setTinkeringActivityData(taData.data());
                })();
            } 
        }
    }, [props]);


    async function handleReferalCodes() {
        const promptRepsonse = prompt("Enter referal code: ");
        if(promptRepsonse !== "" && promptRepsonse !== undefined && promptRepsonse !== null) {
            setLoading(true);
            await axios.get(`https://us-central1-hamaralabs-prod.cloudfunctions.net/paymentIntegration/referal-code?code=${promptRepsonse}`)
            .then(res => {
                if(res.data.error) {
                    setLoading(false);
                    alert("Invalid Referal Code!");
                } else {
                    setDiscount(res.data);
                    setLoading(false);
                    alert("Applied referal code.");
                }
            })
            .catch(err => console.error(err));
        }
    }

    async function handleTinkeringActivityCheckout(){
        props.setLoading(true);
        console.log(discount);
        const currentTimestamp = new Date().getTime();
        const merchantTransactionId = `MT7850${currentTimestamp}`;
        const merchantUserId = `MUI797${currentTimestamp}`;
        if(discount.discount !== 0 && discount.appliesTo.includes("tinkeringActivity")) {
            let discountedValue;
            if(discount.discountType === "price")
                discountedValue = tinkeringActivityAmount - discount.discount
            else
                discountedValue = tinkeringActivityAmount - (tinkeringActivityAmount * discount.discount/100)
                const redirectUrl = `https://app.hamaralabs.com/payments?amount=${discountedValue}&docId=${props.data.taID}&merchantTransactionId=${merchantTransactionId}&merchantId=` + "${merchantId}";
                window.location.href = `https://hamaralabs.com/payment/checkout?amount=${discountedValue}&merchantTransactionId=${merchantTransactionId}&merchantUserId=${merchantUserId}&redirectUrl=${redirectUrl}`;
        } else {
            console.log(tinkeringActivityAmount);
            const redirectUrl = `https://app.hamaralabs.com/payments?amount=${tinkeringActivityAmount}&docId=${props.data.taID}&merchantTransactionId=${merchantTransactionId}&merchantId=` + "${merchantId}";
            window.location.href = `https://hamaralabs.com/payment/checkout?amount=${tinkeringActivityAmount}&merchantTransactionId=${merchantTransactionId}&merchantUserId=${merchantUserId}&redirectUrl=${redirectUrl}`;
        }
    }

    if (loading) {
        return (
            <div style={{height: "85%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                {<Bars
                    height="80"
                    width="80"
                    radius="9"
                    color="black"
                    ariaLabel="loading"
                    wrapperStyle
                    wrapperClass
                />}
            </div>
        );
    }

    if (props.showWhat === "currentPayments") {
        if (props.data.type === "tinkeringActivity") {
            return (
                <div className="box" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                    <div className="name" style={{fontSize: "1.5rem"}}>{props.data.taName}</div>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>TA ID:</span> {props.data.taID}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>TA status:</span> {props.data.paymentInfo.status}</div>
                    <br/>
                    {discount.discountType === "percent" && discount.appliesTo.includes("tinkeringActivity") ? (
                    <>
                        <div className="discountedValue" style={{display: "inline-block"}}>
                            <div className="boxContainer">
                                <span style={{fontWeight: "600"}}>Price:</span> ₹ {Math.round((tinkeringActivityAmount - tinkeringActivityAmount * (discount.discount/100))*100)/100}
                            </div>
                        </div>
                        <div className="originalPrice" style={{display: "inline-block"}}>
                            <div className="boxContainer" style={{
                                textDecoration: discount.discount !== 0 ? "line-through" : "none",
                                fontSize: discount.discount !== 0 ? "1rem" : "" 
                            }}>
                                <span style={{fontWeight: "600"}}></span> ₹{tinkeringActivityAmount}
                            </div>
                        </div>
                    </>
                    ) : (
                        <div className="boxContainer">
                            <span style={{fontWeight: "600"}}>Price:</span>
                            {discount.appliesTo.includes("tinkeringActivity") ? (" ₹ " + (tinkeringActivityAmount - discount.discount)) : ` ₹  ${tinkeringActivityAmount}`}
                        </div>
                    )}
                    {
                        discount.code !== "NONE" ? (
                            <>
                                <br/>
                                <div className="boxContainer">
                                    <span style={{fontWeight: "600"}}>Referal Code:</span> {discount.code}
                                    <button style={{cursor: "pointer", fontSize: "20px"}} onClick={() => setDiscount({code: "NONE",appliesTo: [],discountType: "price",discount: 0})}><i class="fa-solid fa-circle-xmark"></i></button>
                                </div>
                            </>
                        ) : ""
                    }
                    <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                        <button className="submitbutton deleteBtn" onClick={handleReferalCodes}>Referal Code</button>
                        <button className="submitbutton deleteBtn" onClick={handleTinkeringActivityCheckout}>Pay Now</button>
                    </div>
                </div>
            );
        }
    } else {
        if (props.data.type === "tinkeringActivity") {
            return (
                <div className="box" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} style={{backgroundColor: props.data.status === "success" ? "#ccffcc" : "#ffcccc"}}>
                    <div className="name" style={{fontSize: "1.5rem"}}>{props.data.taName}</div>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>TA ID:</span> {tinkeringActivityData.taID}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Transaction ID:</span> {props.data.merchantTransactionId}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Transaction status:</span> {props.data.status}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Amount:</span> {props.data.amount}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Transaction time:</span> {props.data.timestamp}</div>
                </div>
            );
        } else if (props.data.type === "onBoarding") {
            return (
                <div className="box" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} style={{backgroundColor: props.data.status === "success" ? "#ccffcc" : "#ffcccc"}}>
                    <div className="name" style={{fontSize: "1.5rem"}}>Onboard Hamaralabs</div>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Transaction ID:</span> {props.data.merchantTransactionId}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Transaction status:</span> {props.data.status}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Amount:</span> {props.data.amount}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Transaction time:</span> {props.data.timestamp}</div>
                </div>
            );
        }
    }

}

export default PaymentReportBox;