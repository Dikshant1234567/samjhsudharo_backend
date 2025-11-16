# MongoDB Atlas Setup Guide

## Whitelist Your IP Address

To connect to your MongoDB Atlas cluster, you need to whitelist your IP address:

1. **Log in to MongoDB Atlas**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Sign in with your credentials

2. **Navigate to Network Access**
   - Select your project
   - Click on "Network Access" in the left sidebar menu

3. **Add Your IP Address**
   - Click the "Add IP Address" button
   - You can either:
     - Click "Add Current IP Address" to automatically add your current IP
     - Or manually enter your IP address
   - Add a description (optional)
   - Click "Confirm"

4. **Wait for Changes to Apply**
   - It may take a few minutes for the changes to propagate

5. **Restart Your Application**
   - Once your IP is whitelisted, restart your application

## Connection String

Make sure your `.env` file contains the correct connection string:

```
PORT=8888
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appName>
```

Replace `<username>`, `<password>`, `<cluster>`, and `<appName>` with your actual MongoDB Atlas credentials.

## Testing Connection

After whitelisting your IP, run the application again with:

```
npm run dev
```

You should see a successful connection message in the console.