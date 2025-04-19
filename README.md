1.Fontend application created by using react vite package

start command:
 # npm run dev

2.stored the backend url at components api folder on api file 
# src/components/Api/Api.jsx

3.getting the data from the another backend that I have created the same url I am using here to show the restaurents and items data.
Api Url for restaurents and items

# URL:https://multi-vendor-swiggy-clone.onrender.com

4.For setting backend server to your local development you need a mongodb database connection string and set the port number based on your choice

# PORT=8000

# MONGO_CONNECTION_STRING:
mongodb+srv://venkatatrinadh4444:digital-diner@cluster0.pgpzaxu.mongodb.net/digital-diner

this key is used to create the jwt token and the token is stored in the httpOnly cookies as "digital_diner_user_token" name
# MY_SECRET_KEY=digital-diner-venkatatrinadh


5.The node env variable is use state that whether the project is in development or production and after deploying the project. I will change this as a production after pulling the project into your local folder just change the production to development for storing the cookies while developement after developement just before publishing the project change it to production.

# NODE_ENV=development

6.I also created a feature to verify the email while registering a new user for that I used my EMAIL and PASS if you need you can use it otherwise you can replace with your own Eamil and pass

# EMAILID=venkatatrinadh4444@gmail.com
# EMAILPASS=rtecerbfluiivezr

7.List of api end points that i have created.

->getting all restaurents
->You can replace the category by clicking the desired category

# https://multi-vendor-swiggy-clone.onrender.com/firm/get-firms/${clikedCategory}

->Get all the products that associated with the restaurents based on the restaurent id

# https://multi-vendor-swiggy-clone.onrender.com/product/${id}/get-products

->Registering a new user 

# ${API_URI}/user/register-user

->Login for an existing a user

# ${API_URI}/user/logout-user

->Logout user(It removes the token from the httpOnly cookies and set the context null)

# ${API_URI}/user/logout-user

->Sending otp to verify the email before registring new user

# ${API_URI}/verification/send-otp

->Verifying otp to verify the email before registring new user

# ${API_URI}/verification/verify-otp

->Add item to the cart based on the user token

# ${API_URI}/user/add-to-cart

->Remove cart from the cart model based on the user token

# ${API_URI}/user/delete-cart-item/${cartItemId}

->Checkout funtion to place the order based on all the items from the cart added to order model based on the user token that are stored in httpOnly cookie

# ${API_URI}/user/checkout

->Getting all the cart items based on the user token

# ${API_URI}/user/fetch-cart-items

->Getting all the ordered items based on the user token

# ${API_URI}/user/fetch-ordered-items

->To get the user details after logged in and these user details will be stored at the context to access every component.If the context user data is null then it is not possible to perform the operation related the cart and after login to app the token is valid for one hour after it will automatically erases from the cookies until the token exists this url is used to fetch the user details across multiple refreshes.

# ${API_URI}/user/user-details


#Frontend API URL

# https://the-digital-diner.netlify.app/

#Backend API URL

# https://eatoes-assessment-task.onrender.com