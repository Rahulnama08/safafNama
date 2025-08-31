const nodemailer = require("nodemailer");

const mail = "rahulnama0807@gmail.com";
const pass = "jsycwimjvtdoouco";
 

// Setup the Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mail,
    pass: pass,
  },
});

const approvedBookingMail = async (populatedBooking) => {
  try {
    const to = populatedBooking.userId.email;

    await transporter.sendMail({
      from: mail,
      to: to,
      subject: "Booking Approved - सफ़रNama",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #1e3a8a;">Booking Approved</h2>
          <p>Dear <strong>${populatedBooking.userId.name}</strong>,</p>
          <p>We are pleased to inform you that your booking with StaySphere has been approved. Here are the details:</p>
          <ul style="padding-left: 1rem;">
            <li><strong>Booking ID:</strong> ${populatedBooking._id}</li>
            <li><strong>Room:</strong> Room ${
              populatedBooking.roomId.roomNumber
            } (${populatedBooking?.roomId?.roomType})</li>
            <li><strong>Total Amount:</strong> ₹${
              populatedBooking.totalAmount
            }</li>
            <li><strong>Check-In Date:</strong> ${new Date(
              populatedBooking.checkInDate
            ).toLocaleDateString()}</li>
            <li><strong>Check-Out Date:</strong> ${new Date(
              populatedBooking.checkOutDate
            ).toLocaleDateString()}</li>
            <li><strong>Guests:</strong> ${populatedBooking.numberOfGuests}</li>
            <li><strong>Phone:</strong> ${populatedBooking.userPhone}</li>
            <li><strong>Status:</strong> ${
              populatedBooking.status.charAt(0).toUpperCase() +
              populatedBooking.status.slice(1)
            }</li>
          </ul>
          <p>We look forward to welcoming you! If you have any questions, feel free to contact us.</p>
          <p>Best regards,<br>My सफ़रNama Team</p>
        </div>
      `,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = approvedBookingMail;
