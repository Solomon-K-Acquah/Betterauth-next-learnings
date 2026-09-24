import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface OtpEmailProps {
  otp: string;
}

const OtpEmail = ({ otp }: OtpEmailProps) => {
  return (
    <Html lang="en">
      <Head />

      <Tailwind>
        <Preview>Your login code for betterauth-next.</Preview>
        <Body className="m-0 bg-[#f4f6f8] px-4 py-10 font-sans">
          <Container className="mx-auto max-w-90 overflow-hidden rounded-2xl bg-white shadow-sm">
            <Text className="text-[16px] leading-6.5">
              Please find your code to login below
            </Text>

            <Text className="text-2xl leading-5">{otp}</Text>

            <Text className="text-[#8898aa] text-[12px] ">
              If you did not request a code, you can safely ignore this email.
            </Text>

            {/* Footer */}
            <Section className="bg-[#f9fafb] px-8 py-5 text-center">
              <Text className="m-0 text-[12px] leading-4.5 text-[#9ca3af]">
                © {new Date().getFullYear()} Betterauth-next. All rights
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

export default OtpEmail;
