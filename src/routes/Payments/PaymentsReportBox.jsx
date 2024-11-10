import React, {useEffect, useState, useRef} from "react";
import {Bars} from "react-loader-spinner";
import axios from "axios";
import { getDoc } from "firebase/firestore";
import Receipt from "./Receipt";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Popup = React.lazy(() => import("../../components/Popup"));

function PaymentReportBox(props) {
    const [displayValue, setDisplayValue] = useState("none");
    const [openPopup, setOpenPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const receiptRef = useRef();
    const [discount, setDiscount] = useState({
        code: "NONE",
        appliesTo: [],
        discountType: "price",
        discount: 0
    });
    const [tinkeringActivityData, setTinkeringActivityData] = useState({});
    const [receiptData, setReceiptData] = useState({});
    const [popUpLoading, setPopupLoading] = useState(false);
    const [tinkeringActivityAmount, setTinkeringActivityAmount] = useState(0);

    const labelName = {"tinkeringActivity": "Tinkering Activity", "onBoarding": "Onboarding Hamaralabs"};
    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    const uid = split[0];
    const email = split[1];
    const role = split[2];

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

    useEffect(() => {
        if (popUpLoading) {
            console.log(props.data);
            (async () => {
                await axios.post("/paymentIntegration/getStatus", {
                    merchantTransactionId: props.data.merchantTransactionId,
                    merchantId: "{merchantId}"
                }).then((response) => {
                    const tempReceiptData = response.data.data.data;
                    const receiptDataTemp = {
                        date: props.data.timestamp,
                        merchantTransactionId: tempReceiptData?.merchantTransactionId,
                        transactionId: tempReceiptData?.transactionId,
                        paidBy: email,
                        amount: tempReceiptData?.amount,
                        paymentMethod: tempReceiptData?.paymentInstrument.type,
                        notes: 'Payment for services rendered',
                        items: [
                            { description: labelName[props.data.type], quantity: 1, price: tempReceiptData?.amount, total: tempReceiptData?.amount },
                        ]
                    };
                    setReceiptData(receiptDataTemp);
                    setPopupLoading(false);
                }).catch((error) => {
                    console.log(error);
                    const tempReceiptData = props.data;
                    const receiptDataTemp = {
                        date: props.data.timestamp,
                        merchantTransactionId: tempReceiptData.merchantTransactionId,
                        paidBy: email,
                        amount: tempReceiptData.amount,
                        notes: 'Payment for services rendered',
                        items: [
                            { description: labelName[props.data.type], quantity: 1, price: tempReceiptData.amount, total: tempReceiptData.amount },
                        ]
                    };
                    setReceiptData(receiptDataTemp);
                    setPopupLoading(false);
                });

            })();
        }
    }, [popUpLoading]);

    async function handleReferalCodes() {
        const promptRepsonse = prompt("Enter referal code: ");
        if(promptRepsonse !== "" && promptRepsonse !== undefined && promptRepsonse !== null) {
            setLoading(true);
            await axios.get(`/paymentIntegration/referal-code?code=${promptRepsonse}`)
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

    const downloadPDF = () => {
        html2canvas(receiptRef.current).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', [200, 200]); // Increased height: 356mm (A4 height + extra 20mm), A4 width: 216mm
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = pdfWidth;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
            
            const heightExceedsPage = imgHeight > pdfHeight;
            
            // If the image height exceeds the page height, adjust the page height to the image height
            if (heightExceedsPage) {
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.internal.pageSize.height = imgHeight;
            } else {
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, pdfHeight);
            }

            pdf.save('receipt.pdf');
        });
    };

    async function handleTinkeringActivityCheckout(){
        props.setLoading(true);
        console.log(discount);
        const currentTimestamp = new Date().getTime();
        const merchantTransactionId = `MT7850${currentTimestamp}`;
        const merchantUserId = `MUI797${currentTimestamp}`;
        if(discount.discount !== 0 && discount.appliesTo.includes("tinkeringActivity")) {
            let discountedValue;
            if(discount.discountType === "price") {
                discountedValue = tinkeringActivityAmount - discount.discount
            } else
                discountedValue = tinkeringActivityAmount - (tinkeringActivityAmount * discount.discount/100)
            const redirectUrl = `http://localhost:3000/payments?amount=${discountedValue}&docId=${props.data.taID}&merchantTransactionId=${merchantTransactionId}&merchantId=` + "${merchantId}";
            window.location.href = `/payment/checkout?amount=${discountedValue}&merchantTransactionId=${merchantTransactionId}&merchantUserId=${merchantUserId}&redirectUrl=${redirectUrl}`;
        } else {
            const redirectUrl = `http://localhost:3000/payments?amount=${tinkeringActivityAmount}&docId=${props.data.taID}&merchantTransactionId=${merchantTransactionId}&merchantId=` + "${merchantId}";
            console.log(`/payment/checkout?amount=${tinkeringActivityAmount}&merchantTransactionId=${merchantTransactionId}&merchantUserId=${merchantUserId}&redirectUrl=${encodeURIComponent(redirectUrl)}`);
            window.location.href = `/checkout?amount=${tinkeringActivityAmount}&merchantTransactionId=${merchantTransactionId}&merchantUserId=${merchantUserId}&redirectUrl=${encodeURIComponent(redirectUrl)}`;
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
                    {openPopup ? (
                        <Popup trigger={openPopup} setPopupEnabled={setOpenPopup} closeAllowed={true}>
                            {popUpLoading ? (
                            <div style={{height: "85%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <Bars
                                    height="80"
                                    width="80"
                                    radius="9"
                                    color="black"
                                    ariaLabel="loading"
                                    wrapperStyle
                                    wrapperClass
                                    />
                            </div>
                            ) : 
                            <>
                                <Receipt receiptData={Object.keys(receiptData).length > 0 ? receiptData : {}} ref={receiptRef} />
                                <button className="submitbutton deleteBtn" onClick={downloadPDF}>Download PDF</button>
                            </>
                            }
                        </Popup>
                        )  : ""
                    }
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>TA ID:</span> {tinkeringActivityData?.taID}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Transaction ID:</span> {props.data.merchantTransactionId}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Transaction status:</span> {props.data.status}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Amount:</span> {props.data.amount}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Transaction time:</span> {props.data.timestamp}</div>
                    <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                        {props.data.status === "success" ? <button className="submitbutton deleteBtn" onClick={() => {setOpenPopup(true); setPopupLoading(true)}}>Receipt</button> : ""}
                    </div>
                </div>
            );
        } else if (props.data.type === "onBoarding") {
            return (
                <div className="box" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} style={{backgroundColor: props.data.status === "success" ? "#ccffcc" : "#ffcccc"}}>
                    <div className="name" style={{fontSize: "1.5rem"}}>Onboard Hamaralabs</div>
                    {openPopup ? 
                        <Popup trigger={openPopup} setPopupEnabled={setOpenPopup} closeAllowed={true}>
                            {popUpLoading ? (
                            <div style={{height: "85%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <Bars
                                    height="80"
                                    width="80"
                                    radius="9"
                                    color="black"
                                    ariaLabel="loading"
                                    wrapperStyle
                                    wrapperClass
                                    />
                            </div>
                            ) : 
                            <>
                                <Receipt receiptData={Object.keys(receiptData).length > 0 ? receiptData : {}} ref={receiptRef} />
                                <button className="submitbutton deleteBtn" onClick={downloadPDF}>Download PDF</button>
                            </>
                            }
                        </Popup> : ""
                    }
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Transaction ID:</span> {props.data.merchantTransactionId}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Transaction status:</span> {props.data.status}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Amount:</span> {props.data.amount}</div>
                    <br/>
                    <div className="boxContainer"><span style={{fontWeight: "600"}}>Transaction time:</span> {props.data.timestamp}</div>
                    <div className="buttonsContainer" id={"btnContainer"+props.id} style={{display: displayValue}}>
                        {props.data.status === "success" ? <button className="submitbutton deleteBtn" onClick={() => {setOpenPopup(true); setPopupLoading(true)}}>Receipt</button> : ""}
                    </div>
                </div>
            );
        }
    }

}


export default PaymentReportBox;