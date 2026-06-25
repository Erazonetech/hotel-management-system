import React, { useRef } from 'react';
import { FiPrinter, FiDownload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Receipt = ({ order, onClose, onPrint }) => {
  const receiptRef = useRef(null);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${order.orderNumber}</title>
            <style>
              body { font-family: 'Courier New', monospace; padding: 20px; max-width: 350px; margin: 0 auto; background: #fff; }
              .receipt { border: 1px dashed #ddd; padding: 20px; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
              .header h1 { font-size: 20px; margin: 0; }
              .header p { margin: 5px 0; font-size: 12px; color: #666; }
              .divider { border-top: 1px dashed #ccc; margin: 10px 0; }
              .items { margin: 10px 0; }
              .item { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
              .item .name { flex: 1; }
              .item .qty { width: 40px; text-align: center; }
              .item .price { width: 70px; text-align: right; }
              .totals { border-top: 2px solid #000; margin-top: 10px; padding-top: 10px; }
              .total-line { display: flex; justify-content: space-between; font-size: 14px; padding: 3px 0; }
              .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
              .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; padding-top: 10px; border-top: 1px dashed #ccc; }
              .order-info { font-size: 12px; margin: 5px 0; }
              .thank-you { text-align: center; font-size: 16px; font-weight: bold; margin: 15px 0; color: #333; }
              .customer-info { font-size: 12px; margin: 5px 0; }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
                .receipt { border: none; }
              }
            </style>
          </head>
          <body>
            ${receiptRef.current.outerHTML}
            <script>
              window.onload = function() { window.print(); window.close(); }
            <\/script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownload = () => {
    const receiptHTML = receiptRef.current.outerHTML;
    const fullHTML = `
      <html>
        <head>
          <title>Receipt-${order.orderNumber}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; max-width: 350px; margin: 0 auto; }
            .receipt { border: 1px dashed #ddd; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
            .header h1 { font-size: 20px; margin: 0; }
            .divider { border-top: 1px dashed #ccc; margin: 10px 0; }
            .item { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
            .totals { border-top: 2px solid #000; margin-top: 10px; padding-top: 10px; }
            .grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; padding-top: 10px; border-top: 1px dashed #ccc; }
            .thank-you { text-align: center; font-size: 16px; font-weight: bold; margin: 15px 0; }
          </style>
        </head>
        <body>${receiptHTML}</body>
      </html>
    `;
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt-${order.orderNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded successfully!');
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Get payment method display
  const getPaymentMethod = (method) => {
    const methods = {
      cash: 'Cash',
      card: 'Card Payment',
      online: 'Online Payment'
    };
    return methods[method] || method || 'Cash';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold">Receipt</h2>
          <div className="flex gap-2 no-print">
            <button
              onClick={handlePrint}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <FiPrinter className="h-5 w-5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <FiDownload className="h-5 w-5" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div ref={receiptRef} className="p-6">
          <div className="receipt">
            {/* Header */}
            <div className="header">
              <h1>🍽️ HOTEL RESTAURANT</h1>
              <p>123 Restaurant Street, Downtown City</p>
              <p>Tel: +1 (234) 567-8900</p>
              <p>Email: info@hotelrestaurant.com</p>
              <div className="divider"></div>
              <p>GST/HST: 123456789</p>
            </div>

            {/* Order Info */}
            <div className="order-info">
              <div><strong>Order #:</strong> {order.orderNumber}</div>
              <div><strong>Date:</strong> {formatDate(order.createdAt)}</div>
              <div><strong>Table:</strong> {order.table?.tableNumber || 'Takeaway'}</div>
              <div><strong>Order Type:</strong> {order.orderType || 'Dine-in'}</div>
              <div><strong>Status:</strong> <span className="text-green-600">PAID</span></div>
              <div className="divider"></div>
            </div>

            {/* Customer Info */}
            {order.customer?.name || order.guestInfo?.name ? (
              <div className="customer-info">
                <strong>Customer:</strong> {order.customer?.name || order.guestInfo?.name}
                {order.customer?.email && <div><strong>Email:</strong> {order.customer.email}</div>}
                {order.customer?.phone && <div><strong>Phone:</strong> {order.customer.phone}</div>}
                <div className="divider"></div>
              </div>
            ) : null}

            {/* Items */}
            <div className="items">
              <div className="item" style={{ fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '5px' }}>
                <span className="name">Item</span>
                <span className="qty">Qty</span>
                <span className="price">Price</span>
              </div>
              {order.items?.map((item, index) => (
                <div key={index} className="item">
                  <span className="name">{item.name}</span>
                  <span className="qty">{item.quantity}</span>
                  <span className="price">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="divider"></div>

            {/* Totals */}
            <div className="totals">
              <div className="total-line">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="total-line">
                <span>Tax (15%)</span>
                <span>{formatCurrency(order.tax || order.subtotal * 0.15)}</span>
              </div>
              {order.serviceCharge > 0 && (
                <div className="total-line">
                  <span>Service Charge</span>
                  <span>{formatCurrency(order.serviceCharge)}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="total-line" style={{ color: '#e74c3c' }}>
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="grand-total">
                <span>TOTAL</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="divider"></div>

            {/* Payment Info */}
            <div className="payment-info" style={{ fontSize: '12px' }}>
              <div><strong>Payment Method:</strong> {getPaymentMethod(order.paymentMethod)}</div>
              <div><strong>Payment Status:</strong> <span className="text-green-600">PAID</span></div>
              {order.paymentProcessedBy?.name && (
                <div><strong>Processed By:</strong> {order.paymentProcessedBy.name}</div>
              )}
              <div><strong>Transaction ID:</strong> TXN-{Date.now()}</div>
              <div className="divider"></div>
            </div>

            {/* Staff Info */}
            <div className="staff-info" style={{ fontSize: '12px' }}>
              {order.confirmedBy?.name && (
                <div><strong>Confirmed By:</strong> {order.confirmedBy.name}</div>
              )}
              {order.preparedBy?.name && (
                <div><strong>Prepared By:</strong> {order.preparedBy.name}</div>
              )}
              {order.servedBy?.name && (
                <div><strong>Served By:</strong> {order.servedBy.name}</div>
              )}
            </div>

            {/* Thank You */}
            <div className="thank-you">
              Thank you for dining with us!
            </div>

            <div className="divider"></div>

            {/* Footer */}
            <div className="footer">
              <p>💳 We accept all major credit cards</p>
              <p>🌐 www.hotelrestaurant.com</p>
              <p>⭐ Follow us on social media</p>
              <p className="mt-2" style={{ fontSize: '10px', color: '#999' }}>
                Please retain this receipt for your records
              </p>
              <p className="mt-1" style={{ fontSize: '10px', color: '#999' }}>
                Items are GST/HST included where applicable
              </p>
              <p style={{ fontSize: '10px', color: '#999', marginTop: '5px' }}>
                Printed: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;