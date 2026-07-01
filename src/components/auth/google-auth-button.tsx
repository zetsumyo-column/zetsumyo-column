import { signInWithGoogle, signUpWithGoogle } from "@/app/actions/auth";

type GoogleAuthButtonProps = {
  mode: "login" | "signup";
};

const config = {
  login: {
    label: "Googleでログイン",
    action: signInWithGoogle,
  },
  signup: {
    label: "Googleで新規登録",
    action: signUpWithGoogle,
  },
} as const;

export function GoogleAuthButton({ mode }: GoogleAuthButtonProps) {
  const { label, action } = config[mode];

  return (
    <form action={action}>
      <button type="submit" className="btn-outline w-full">
        {label}
      </button>
    </form>
  );
}
