import "./editor.scss";
import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import { __ } from "@wordpress/i18n";
registerBlockType("zita-blocks/zita-post", {
  title: __("Post List Layout", "zita-blocks"),
  icon: "format-aside",
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
