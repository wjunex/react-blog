import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";

type MDXContentProps = {
  source: string;
};

const components: MDXComponents = {
  a: ({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) => {
    if (href.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target={href.startsWith("#") ? undefined : "_blank"}
        rel={href.startsWith("#") ? undefined : "noopener noreferrer"}
        {...props}
      >
        {children}
      </a>
    );
  },
};

export default function MDXContent({ source }: MDXContentProps) {
  return (
    <article className="mdx-content">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            format: "md",
          },
        }}
      />
    </article>
  );
}
