import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  verificationUrl: string;
  userName: string;
  appName?: string;
}

const VerificationEmail = ({
  verificationUrl,
  userName,
  appName = "Betterauth-Next",
}: VerificationEmailProps) => {
  return (
    <Html lang="en">
      <Head />

      <Preview>
        Verify your email address to complete your {appName} account setup.
      </Preview>

      <Tailwind>
        <Body className="m-0 bg-[#f4f6f8] px-4 py-10 font-sans">
          <Container className="mx-auto max-w-90 overflow-hidden rounded-2xl bg-white shadow-sm">
            {/* Header */}
            <Section className="px-8 pt-8 text-center">
              <Text className="m-0 text-[24px] font-bold tracking-[-0.5px] text-[#111827]">
                {appName}
              </Text>

              <Text className="mb-0 mt-2 text-[13px] font-medium uppercase tracking-[1.5px] text-[#6b7280]">
                Email Verification
              </Text>
            </Section>

            {/* Main content */}
            <Section className="px-8 py-8">
              <Heading className="m-0 text-center text-[26px] font-bold leading-8.5 tracking-[-0.5px] text-[#111827]">
                Verify your email
              </Heading>

              <Text className="mt-7 text-[16px] leading-6.5 text-[#374151]">
                Hi {userName},
              </Text>

              <Text className="text-[16px] leading-6.5 text-[#4b5563]">
                Welcome to {appName}! We&apos;re excited to have you on board.
                Please verify your email address to complete your account setup.
              </Text>

              {/* Button */}
              <Section className="my-8 text-center">
                <Button
                  href={verificationUrl}
                  className="rounded-lg bg-[#5F51E8] px-7 py-3.5 text-[15px] font-semibold text-white no-underline"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-[13px] leading-5.25 text-[#6b7280]">
                This verification link is unique to your account and should not
                be shared with anyone.
              </Text>

              {/* Fallback URL */}
              <Text className="mt-6 text-[13px] leading-5.25 text-[#6b7280]">
                If the button above doesn&apos;t work, copy and paste the
                following link into your browser:
              </Text>

              <Text className="break-all rounded-lg bg-[#f3f4f6] p-3 text-[12px] leading-4.5 text-[#6b7280]">
                {verificationUrl}
              </Text>
            </Section>

            {/* Divider */}
            <Hr className="mx-8 border-[#e5e7eb]" />

            {/* Security notice */}
            <Section className="px-8 py-6">
              <Text className="m-0 text-[13px] leading-5.25 text-[#6b7280]">
                <strong className="text-[#374151]">
                  Didn&apos;t create an account?
                </strong>
                <br />
                You can safely ignore this email. No action is required.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-[#f9fafb] px-8 py-5 text-center">
              <Text className="m-0 text-[12px] leading-4.5 text-[#9ca3af]">
                © {new Date().getFullYear()} {appName}. All rights reserved.
              </Text>

              <Text className="m-0 mt-1 text-[12px] leading-4.5 text-[#9ca3af]">
                This is an automated email. Please do not reply.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
