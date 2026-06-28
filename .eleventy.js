module.exports = function (eleventyConfig) {
  // Count kits in a given category
  eleventyConfig.addFilter("categoryCount", function (kits, category) {
    return kits.filter((k) => k.category === category).length;
  });

  // Copy public/images/ to dist/images/
  eleventyConfig.addPassthroughCopy({ "public/images": "images" });

  // Copy src/css/ to dist/css/
  eleventyConfig.addPassthroughCopy("src/css");

  // Copy src/js/ to dist/js/
  eleventyConfig.addPassthroughCopy("src/js");

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
