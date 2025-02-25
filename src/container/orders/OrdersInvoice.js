import React from "react";
import invoiceStyles from "./invoice.module.css";

const OrdersInvoice = () => {
    return (
        <div className={invoiceStyles.invoiceContainer}>
            <header className={invoiceStyles.header}>
                <div className={invoiceStyles.logoStyle}>
                    <img src="/jewelsLogo.png" className={invoiceStyles.imageStyle} alt="Logo" />
                    <div>
                        <h1 className={invoiceStyles.invoiceText}>INVOICE</h1>
                        <p className={invoiceStyles.companyText}>COMPANY LLC</p>
                    </div>
                </div>
                <div>
                    <p className={invoiceStyles.invoiceNumber}>#2023-00</p>
                    <p className={invoiceStyles.invoiceNumberText}>INVOICE NUMBER</p>
                </div>
            </header>

            <section className={invoiceStyles.details}>
                <div className={invoiceStyles.fromTo}>
                    <div>
                        <h3 className={invoiceStyles.h3Style}>TO</h3>
                        <p className={invoiceStyles.myCompany}>Customer name</p>
                        <p className={invoiceStyles.addressTextStyle}>4 th street , 3 main,
                            kalyan nagar, bangalore</p>
                        <p className={invoiceStyles.addressTextStyle} style={{ marginTop: 10 }}>PAN: NDGV1234</p>
                        <p className={invoiceStyles.addressTextStyle}>Contact: 9876543210</p>
                        <p className={invoiceStyles.addressTextStyle}>State: Karnataka</p>
                        <p className={invoiceStyles.addressTextStyle}>State Code: 29</p>
                        <p className={invoiceStyles.addressTextStyle}>GSTIN/Unique ID: URD</p>
                    </div>
                    <div>
                        <h3 className={invoiceStyles.h3Style}>FROM</h3>
                        <p className={invoiceStyles.myCompany}>Company</p>
                        <p className={invoiceStyles.addressTextStyle}>4 th street , 3 main,
                            kalyan nagar, bangalore</p>
                        <p className={invoiceStyles.addressTextStyle} style={{ marginTop: 10 }}>Contact: 9876543210</p>
                        {/* <p className={invoiceStyles.addressTextStyle}>20037, United States</p> */}
                        {/* <p className={invoiceStyles.addressTextStyle}>EIN Number: 22-2143333</p> */}
                    </div>
                </div>
                <div className={invoiceStyles.paymentInfo} style={{ marginTop: 20 }}>
                    <div>
                        <p></p>
                        <p className={invoiceStyles.myCompany}>Date:</p>
                        <p className={invoiceStyles.myCompany}>State:</p>
                        <p className={invoiceStyles.myCompany}>State code:</p>
                        <p className={invoiceStyles.myCompany}>GSTIN:</p>
                    </div>
                    <div>
                        <p></p>
                        <p className={invoiceStyles.addressStyle} style={{ textAlign: 'right' }}> 01.16.2023.</p>
                        <p className={invoiceStyles.addressStyle} style={{ textAlign: 'right' }}>Karnataka</p>
                        <p className={invoiceStyles.addressStyle} style={{ textAlign: 'right' }}> 29</p>
                        <p className={invoiceStyles.addressStyle} style={{ textAlign: 'right' }}> 29AAHPC4317P1ZF</p>
                    </div>
                </div >
            </section >

            {/* <table className={invoiceStyles.invoiceTable}>
                <thead>
                    <tr>
                        <th>SL NO</th>
                        <th>Name of the goods supplied</th>
                        <th>HSN</th>
                        <th>QTY in Grams</th>
                        <th>GOLD RATE</th>
                        <th>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1.</td>
                        <td>Pure Gold ornaments 916 Hallmark<br />Making charges: 10%</td>
                        <td>7113</td>
                        <td>10</td>
                        <td>₹2000</td>
                        <td>₹2000</td>
                    </tr>
                </tbody>
            </table> */}
            <div className={invoiceStyles.invoiceTable}>
                <div className={invoiceStyles.slNoStyle}>SL NO</div>
                <div className={invoiceStyles.nameStyle}>Name of the goods supplied</div>
                <div className={invoiceStyles.hsnStyle}>HSN</div>
                <div className={invoiceStyles.qtyStyle}>QTY in Grams</div>
                <div className={invoiceStyles.goldRateStyle}>GOLD RATE</div>
                <div className={invoiceStyles.totalStyle}>TOTAL</div>
            </div>
            <div className={invoiceStyles.tableData}>
                <div className={invoiceStyles.slNoStyle}>1.</div>
                <div className={invoiceStyles.nameStyle}>Pure Gold ornaments 916 Hallmark<br />
                    <span className={invoiceStyles.charges}>Making charges: 10%</span>
                </div>
                <div className={invoiceStyles.hsnStyle} style={{ fontSize: 9, color: '#101011' }}>7113</div>
                <div className={invoiceStyles.qtyStyle} style={{ fontSize: 9, color: '#101011' }}>10</div>
                <div className={invoiceStyles.goldRateStyle} style={{ fontSize: 9, color: '#101011' }}>₹2000</div>
                <div className={invoiceStyles.totalStyle} style={{ fontSize: 9, color: '#101011', fontWeight: 600 }}>₹2000</div>
            </div>
            <div className={invoiceStyles.totalAmount} >
                <div className={invoiceStyles.invoiceGstText} style={{ fontSize: 12 }}>Total Amount before tax GST ( SGST / UGST / CGST / IGST )</div>
                <div className={invoiceStyles.invoiceGstText}>₹2000</div>
            </div>
            <div className={invoiceStyles.bottomLine} />
            <div className={invoiceStyles.gstHeaderStyle} >
                <div className={invoiceStyles.invoiceGst} >IGST (3%) </div>
                <div className={invoiceStyles.invoiceGstText}>₹0</div>
            </div>
            <div className={invoiceStyles.gstHeaderStyle} >
                <div className={invoiceStyles.invoiceGst}>SGST (1.5%) </div>
                <div className={invoiceStyles.invoiceGstText}>₹0</div>
            </div>
            <div className={invoiceStyles.gstHeaderStyle} >
                <div className={invoiceStyles.invoiceGst}>CGST (1.5%) </div>
                <div className={invoiceStyles.invoiceGstText}>₹0</div>
            </div>
            <div className={invoiceStyles.totalAmount} >
                <div className={invoiceStyles.invoiceGstText} style={{ fontSize: 12 }}>Total Amount Payable inclusive of  GST tax ( SGST / UGST / CGST / IGST)</div>
                <div className={invoiceStyles.invoiceTotalAmount} >TOTAL AMOUNT</div>
                <div className={invoiceStyles.invoiceGstText} style={{ fontSize: 14, fontWeight: 700 }}>₹2000</div>
            </div>
            <div className={invoiceStyles.bottomLine} />
            <div className={invoiceStyles.inwordsStyle}>
                <div className={invoiceStyles.inWords}>Inwords:</div>
                <div className={invoiceStyles.numInWords}>INR SIX THOUSAND FOUR HUNDRED EIGTY </div>
            </div>
            <div className={invoiceStyles.bottomLine} />
            <section className={invoiceStyles.summary}>
                <div className={invoiceStyles.notes}>
                    <h3 className={invoiceStyles.declaration}>Declaration</h3>
                    <p className={invoiceStyles.declarationText}> 1. I/We declare that this invoice shows actual price of the  goods described and that all particulars are true and correct.<br/>
                     2. Error and Omission in the this invoice shall be subject to the jurisdiction of the Bangalore</p>
                </div>
                <div className={invoiceStyles.totals}>
                    <p className={invoiceStyles.logoTitle}>For Pavithra jewels</p>
                    <p className={invoiceStyles.signStyle}>Customer sign</p>
                    <p className={invoiceStyles.authorityStyle}>Authorised Signatory</p>
                </div>
            </section>
        </div >
    );
};

export default OrdersInvoice;
