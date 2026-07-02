import { signInWithGoogle, signUpWithGoogle } from "@/app/actions/auth";

type GoogleAuthButtonProps = {
  mode: "login" | "signup";
  next?: string;
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

export function GoogleAuthButton({ mode, next }: GoogleAuthButtonProps) {
  const { label, action } = config[mode];

  return (
    <form action={action}>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <button type="submit" className="btn-outline w-full">
        {label}
      </button>
    </form>
  );
}
