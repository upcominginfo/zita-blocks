import "./editor.scss";
import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
registerBlockType("zita-blocks/zita-post-section-five-post", {
  title: "Post Image Layout Five",
  icon: "tagcloud",
  category: "zita-category",
  getEditWrapperProps(attributes) {
    let attr_ = { "data-align": "full" };
    return attr_;
  },
  keywords: ["post"],
  // attributes: attrSave,
  example: () => {},
  edit: Edit,
  save: () => {
    return null;
  },
});
