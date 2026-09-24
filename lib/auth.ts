import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma"; // your prisma client instance
import { nextCookies } from "better-auth/next-js";
import { sendVerificationEmail } from "./send-verification-email";
import { admin, twoFactor } from "better-auth/plugins";
import { sendOtpEmail } from "./send-otp-email";
import { sendResetPasswordEmail } from "./send-reset-password-email";
import { ac, roles } from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ url }) => {
      void sendResetPasswordEmail({
        to: "kofifrankie@gmail.com",
        subject: "Reset your password",
        url,
      });
    },
  },

  //limit access
  rateLimit: {
    enabled: true,
    window: 10,
    max: 2,
  },

  //email verification
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        to: "kofifrankie@gmail.com",
        verificationUrl: url,
        userName: user.name,
      });
    },
  },

  baseURL: process.env.BETTER_AUTH_URL,

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },

  plugins: [
    nextCookies(),
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ otp }) {
          sendOtpEmail({ to: "kofifrankie@gmail.com", otp });
        },
      },
    }),
    admin({
      ac,
      roles,
      defaultRole: "user",
      adminRoles: ["admin", "superadmin"],
    }),
  ],
});
