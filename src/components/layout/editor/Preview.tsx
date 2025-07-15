import React from "react";

import { MDXRemote } from "next-mdx-remote/rsc";

import { Code } from "bright";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

function Preview({ content = "" }: { content: string }) {
  return (
    <section className="prose markdown grid break-words">
      <MDXRemote
        source={content}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="dark:shadow-dark-200 shadow-light-200"
            />
          ),
        }}
      />
    </section>
  );
}

export default Preview;
