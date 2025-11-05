import React from "react";

export default function ToggleInput() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <input
          id="switch-link"
          type="checkbox"
          className="appearance-none relative inline-block rounded-full w-6 h-3 cursor-pointer before:inline-block before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-full before:bg-stone-200 before:transition-colors before:duration-200 before:ease-in after:absolute after:top-2/4 after:left-0 after:-translate-y-2/4 after:w-6 after:h-6 after:border after:border-stone-200 after:bg-white after:rounded-full checked:after:translate-x-full after:transition-all after:duration-200 after:ease-in disabled:opacity-50 disabled:cursor-not-allowed dark:after:bg-white checked:before:bg-stone-800 checked:after:border-stone-800"
        />
        <label
          htmlFor="switch-link"
          className="font-sans antialiased text-base cursor-pointer text-stone-600"
        >
          I agree with the
          <a
            href="#"
            className="font-sans antialiased text-base text-stone-500 inline"
          >
            terms and conditions
          </a>
        </label>
      </div>

      <p className="text-center mt-4 text-sm text-gray-700">
        Inspired by
        <a
          href="https://www.creative-tim.com/david-ui/docs/html/switch"
          className="text-blue-600 hover:underline"
          target="_blank"
        >
          David UI
        </a>
        Framework
      </p>
    </div>
  );
}
