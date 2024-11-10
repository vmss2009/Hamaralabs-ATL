import React from "react";
import HamaralabsImage from "../../HL Sticker.png";

const Receipt = React.forwardRef(({ receiptData }, ref) => {
  return (
    <div className="receipt-container" ref={ref}>
      <link rel="stylesheet" href="/CSS/receipt.css" />
      <div className="header">
        <img src={HamaralabsImage} alt="Logo" className="logo" />
        <h1>Payment Receipt</h1>
        <p>SketchEA IT Consultants Pvt Ltd.</p>
        <p>#38-37-63, Bhaskar Gardens, Marripalem, Visakhapatnam</p>
        <p>Andhra Pradesh, PIN Code - 530018</p>
      </div>
      <div>
        <p>
          <strong>Date:</strong> {receiptData.date}
        </p>
        <p>
          <strong>Merchant Transaction Id:</strong> {receiptData.merchantTransactionId}
        </p>
          {receiptData.transactionId &&
            <p>
                <strong>Transaction Id:</strong> {receiptData.transactionId}
            </p>
          }
        <p>
          <strong>Paid By:</strong> {receiptData.paidBy}
        </p>
          {receiptData.paymentMethod &&
            <p>
                <strong>Payment Method:</strong> {receiptData.paymentMethod}
            </p>
          }
      </div>
        <div className="items-section">
            <h2>Items</h2>
            <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {receiptData.items.map((item, index) => (
              <tr key={index}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
                <td>₹{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="total-section">
        <p>
          <strong>Total Amount:</strong> ₹{receiptData.amount}
        </p>
      </div>
      <div className="notes-section">
        <p>
          <strong>Notes:</strong> {receiptData.notes}
        </p>
      </div>
    </div>
  );
});

export default Receipt;