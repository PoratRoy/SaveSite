# Deployment Guide for SaveSite

## Vercel Deployment

### Prerequisites
1. A Vercel account connected to your GitHub repository
2. A Neon PostgreSQL database
3. Google OAuth credentials
4. LinkPreview API key

### Environment Variables

Add the following environment variables in your Vercel project settings:

#### Database
- `DATABASE_URL` - Your Neon PostgreSQL connection string

#### NextAuth
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)

#### Google OAuth
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

#### Link Preview API
- `LINKPREVIEW_API_KEY` - From LinkPreview.net

### Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add all the variables listed above
   - Make sure to add them for Production, Preview, and Development environments

4. **Deploy**
   - Vercel will automatically deploy on push
   - Or manually trigger a deployment from the Vercel dashboard

### Troubleshooting

#### Build Fails with Prisma Error
- Ensure `DATABASE_URL` is set in environment variables
- The `postinstall` script should automatically run `prisma generate`

#### Authentication Issues
- Verify `NEXTAUTH_URL` matches your production URL
- Check Google OAuth redirect URIs include your Vercel domain

#### Database Connection Issues
- Ensure your Neon database allows connections from Vercel
- Verify the `DATABASE_URL` is correct and includes all parameters

### Post-Deployment

1. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

2. **Verify OAuth Redirect URIs**
   - Add your Vercel URL to Google Cloud Console OAuth redirect URIs
   - Format: `https://your-app.vercel.app/api/auth/callback/google`

3. **Test the Application**
   - Try signing in with Google
   - Create a folder and website
   - Verify all features work correctly

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/PoratRoy/SaveSite.git
   cd SaveSite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in all required values

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run postinstall` - Generate Prisma Client (runs automatically)
