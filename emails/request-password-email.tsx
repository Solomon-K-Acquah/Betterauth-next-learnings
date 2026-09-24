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

interface ResetPasswordEmailProps {
  url: string;
  to: string;
}

const ResetPasswordEmail = ({ url, to }: ResetPasswordEmailProps) => {
  return (
    <Html lang="en">
      <Head />

      <Tailwind>
        <Body className="m-0 bg-[#f4f6f8] px-4 py-10 font-sans">
          <Preview>Reset your password for betterauth-next.</Preview>

          <Container className="mx-auto max-w-90 overflow-hidden rounded-2xl bg-white shadow-sm">
            <Heading
              as="h1"
              className="mb-3 text-center text-[20px] font-semibold text-black"
            >
              Hello
            </Heading>

            <Text className="text-[16px] leading-6.5">
              We received a request to reset the password for betterauth-next
              account associated with {to}
            </Text>

            {/* Header */}
            <Section className="px-8 pt-8 text-center">
              <Text className="mb-0 mt-2 text-[13px] font-medium uppercase tracking-[1.5px] text-[#6b7280]">
                Reset your password
              </Text>
            </Section>

            {/* Main content */}
            <Section className="px-8 py-8">
              {/* Button */}
              <Section className="my-8 text-center">
                <Button
                  href={url}
                  className="rounded-lg bg-[#5F51E8] px-7 py-3.5 text-[15px] font-semibold text-white no-underline"
                >
                  Reset your password
                </Button>
              </Section>

              {/* Fallback URL */}
              <Text className="mt-6 text-[13px] leading-5.25 text-[#6b7280]">
                If the button above doesn&apos;t work, copy and paste the
                following link into your browser:
              </Text>

              <Text className="break-all rounded-lg bg-[#f3f4f6] p-3 text-[12px] leading-4.5 text-[#6b7280]">
                {url}
              </Text>
            </Section>

            {/* Divider */}
            <Hr className="mx-8 border-[#e5e7eb]" />

            {/* Footer */}
            <Section className="bg-[#f9fafb] px-8 py-5 text-center">
              <Text className="m-0 text-[12px] leading-4.5 text-[#9ca3af]">
                © {new Date().getFullYear()} betterauth-next. All rights
                reserved.
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

export default ResetPasswordEmail;
