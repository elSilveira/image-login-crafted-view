
interface FooterLink {
  title: string;
  url: string;
}

interface FooterGroupProps {
  title: string;
  links: FooterLink[];
}

export const FooterGroup = ({ title, links }: FooterGroupProps) => {
  return (
    <div>
      <h3 className="font-outfit font-semibold mb-4 text-iazi-text">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.title}>
            <a href={link.url} className="hover:text-iazi-primary font-inter">
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
