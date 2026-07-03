import { SnsPlatformIcon } from "@/components/icons/sns-icons";
import {
  getActiveSnsLinks,
  profileToSnsUrls,
  type ProfileSnsFields,
} from "@/lib/profile/sns";

type ProfileSnsLinksProps = {
  profile: ProfileSnsFields;
  className?: string;
};

export function ProfileSnsLinks({ profile, className }: ProfileSnsLinksProps) {
  const links = getActiveSnsLinks(profileToSnsUrls(profile));

  if (links.length === 0) {
    return null;
  }

  return (
    <ul className={["profile-sns-links", className].filter(Boolean).join(" ")}>
      {links.map((link) => (
        <li key={link.key}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="profile-sns-link"
            aria-label={link.label}
          >
            <SnsPlatformIcon platform={link.key} className="profile-sns-icon" />
          </a>
        </li>
      ))}
    </ul>
  );
}
