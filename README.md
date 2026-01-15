# Amaghor Admin Dashboard

This is the admin dashboard for the Amaghor platform, separated from the main website for better security and maintainability.

## Features

- **User Management**: Manage users, roles, and permissions
- **Content Management**: Manage website content and pages  
- **Analytics & Reports**: View detailed analytics and reports
- **Partner Management**: Manage hotel partners and applications
- **PMS Features**: Enable/disable pro features for hotel partners
- **Booking System**: Monitor all bookings and reservations
- **Payment Management**: Manage payments and transactions
- **Transport Management**: Manage CNG, Bus, and Boat bookings
- **Security & Logs**: Security monitoring and audit logs
- **System Health**: Monitor system performance

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:

   - `NEXTAUTH_SECRET`: A secure random string for authentication
   - `NEXTAUTH_URL`: The URL where your admin panel is hosted (default: http://localhost:3001)
   - `ADMIN_EMAIL`: The email for the admin user
   - `ADMIN_PASSWORD`: The password for the admin user

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run postinstall
   
   # Push database schema
   npm run db:push
   
   # Seed the database (optional)
   npm run db:seed
   ```

4. **Development**
   ```bash
   npm run dev
   ```
   
   The admin dashboard will be available at `http://localhost:3001`

5. **Production**
   ```bash
   npm run build
   npm start
   ```

## Authentication

The admin panel uses NextAuth.js for authentication with credentials provider. Access is restricted to users with admin roles or the configured admin email.

Default admin credentials (for development):
- Email: admin@amaghor.com
- Password: admin123

**Important**: Change these credentials in production!

## Project Structure

```
src/
├── app/
│   ├── analytics/          # Analytics pages
│   ├── bookings/          # Booking management
│   ├── content/           # Content management
│   ├── dashboard/         # Main dashboard
│   ├── partners/          # Partner management
│   ├── payments/          # Payment management
│   ├── pms-features/      # PMS feature management
│   ├── security/          # Security logs
│   ├── settings/          # System settings
│   ├── system/            # System health
│   ├── transport/         # Transport management
│   └── users/             # User management
├── components/
│   ├── ui/               # Reusable UI components
│   └── providers/        # React providers
└── lib/                  # Utility functions and configurations
```

## Security

- Protected routes with NextAuth.js middleware
- Role-based access control
- Secure session management
- Environment variable configuration for sensitive data

## Deployment

1. Build the application: `npm run build`
2. Set environment variables on your hosting platform
3. Deploy the built application
4. Ensure the database is accessible from your deployment environment

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test your changes thoroughly
4. Submit a pull request

## Support

For issues and support, please contact the development team.