

const nodemailer=require('nodemailer')

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAILID,
        pass:process.env.EMAILPASS
    }
})
const sendOtp=async(email,otp)=> {
    const mailOptions={
        from:process.env.EMAILID,
        to:email,
        subject:'Verify your email - OTP code',
        html:`<div>
        <p>Your OTP code is given below.It is valid for 5 minutes</p>
        <h3 style="text-align:center;color:blue;background-color:silver">${otp}</h3>
        </div>`
    }
    await transporter.sendMail(mailOptions)
}

module.exports=sendOtp