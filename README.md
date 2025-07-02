# Local Development

Run mongod.exe,
npm run start
Open mongosh.exe

# Migrate Changes to Production

Note:
CD is not configured in this project
Previously, server didn't run in Windows-based Web App with Github CD configured
So, in a desperate attempt, I resorted to deploying the server using Azure Tools extension -- and it worked.
Changes are so expensive to sync; don't bother moving to a new Web App

1. right-click the `server` directory
2. select `Deploy to Web App`
3. select `virtubooks`
