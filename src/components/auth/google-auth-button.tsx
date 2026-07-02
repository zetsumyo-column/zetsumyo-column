import { signInWithGoogle, signUpWithGoogle } from "@/app/actions/auth";

type GoogleAuthButtonProps = {
  mode: "login" | "signup";
  origin: string;
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

export function GoogleAuthButton({ mode, origin, next }: GoogleAuthButtonProps) {
  const { label, action } = config[mode];

  return (
    <form action={action}>
      <input type="hidden" name="origin" value={origin} />
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <button type="submit" className="btn-outline w-full">
        {label}
      </button>
    </form>
  );
}
