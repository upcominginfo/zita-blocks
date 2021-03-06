import {
  RichText,
  InspectorControls,
  ColorPalette,
  MediaUpload,
} from "@wordpress/block-editor";
import {
  PanelBody,
  RangeControl,
  ColorPicker,
  ToggleControl,
  SelectControl,
} from "@wordpress/components";
import { Component } from "@wordpress/element";
import { withSelect } from "@wordpress/data";
import {
  showCateFn,
  showTagsFn,
  excerptWords,
  filterPostInit,
  firstTimeInit,
  categoryList,
  PostNotfound,
  PostLoader,
} from "../block-assets/post-functions";
import { __ } from "@wordpress/i18n";
let bgImageWrapper = plugin_url.url + "assets/img/image2.jpg";
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      trigger: "linear",
      posts: [],
      category: [],
      totalPost: null,
    };
  }
  // rest api call
  componentDidMount() {
    let sendData = { featured_image: 1 };
    firstTimeInit(this, sendData);
  }
  updateObj = (parent_key, child_key, initialValue, value_) => {
    let newNewValue = [...initialValue];
    newNewValue[0][child_key] = value_;
    let setAttr_ = {};
    setAttr_[parent_key] = newNewValue;
    this.props.setAttributes(setAttr_);
  };
  updateGlobalSlide = (value, for_, type) => {
    let sliderSetting = this.props.attributes.sliderSetting;
    let newSetting = [...sliderSetting];
    if (type) {
      newSetting[0][for_][type] = value;
    } else {
      newSetting[0][for_] = value;
    }
    this.props.setAttributes({ sliderSetting: newSetting });
  };
  render() {
    const { attributes, setAttributes } = this.props;
    const { posts, category, totalPost, slideIndex } = this.state;
    let {
      heading,
      author,
      numberOfPosts,
      date,
      showTag,
      showCate,
      excerpt,
      postCategories,
      meta_style,
      title,
      sliderSetting,
    } = attributes;
    let heading_ = heading[0];
    let excerpt_ = excerpt[0];
    let date_ = date[0];
    let author_ = author[0];
    let meta_style_ = meta_style[0];
    let title_ = title[0];
    let showTag_ = showTag[0];
    let showCate_ = showCate[0];
    // category init
    let cateGory = [];
    if (!category) {
      cateGory = false;
    } else {
      cateGory = categoryList(category);
    }
    sliderSetting = sliderSetting[0];
    let SlideulStyle = null;
    if (sliderSetting.dimension.height) {
      SlideulStyle = { minHeight: sliderSetting.dimension.custom_height };
    }
    let leftRightStyle = {
      color: sliderSetting.leftRightTrigger.color,
      backgroundColor: sliderSetting.leftRightTrigger.backgroundColor,
      fontSize: sliderSetting.leftRightTrigger.fontSize,
    };
    let triggerActive = this.state.trigger;
    let trigStyle = {
      height: sliderSetting.linearTrigger.fontSize + "px",
      width: sliderSetting.linearTrigger.fontSize + "px",
    };

    return (
      <>
        <InspectorControls>
          <PanelBody
            title={__("Block Title", "zita-blocks")}
            initialOpen={false}
          >
            <ToggleControl
              label={
                title_.enable
                  ? __("Hide", "zita-blocks")
                  : __("Show", "zita-blocks")
              }
              checked={title_.enable}
              onChange={(e) => this.updateObj("title", "enable", title, e)}
            />
            {title_.enable && (
              <>
                <p>
                  <strong>{__("Title Alignment", "zita-blocks")}</strong>
                </p>
                <div className="zita-alignment">
                  <div>
                    <span
                      onClick={() => {
                        this.updateObj("title", "align", title, "left");
                      }}
                      className={`dashicons dashicons-editor-alignleft ${
                        title_.align == "left" && "active"
                      }`}
                    ></span>
                  </div>
                  <div>
                    <span
                      onClick={() => {
                        this.updateObj("title", "align", title, "center");
                      }}
                      className={`dashicons dashicons-editor-aligncenter ${
                        title_.align == "center" && "active"
                      }`}
                    ></span>
                  </div>
                  <div>
                    <span
                      onClick={() => {
                        this.updateObj("title", "align", title, "flex-end");
                      }}
                      className={`dashicons dashicons-editor-alignright ${
                        title_.align == "flex-end" && "active"
                      }`}
                    ></span>
                  </div>
                </div>

                <RangeControl
                  label={__("Font Size", "zita-blocks")}
                  value={title_.fontSize}
                  min={5}
                  max={50}
                  onChange={(e) => {
                    this.updateObj("title", "fontSize", title, e);
                  }}
                />
                <p>
                  <strong>{__("Color", "zita-blocks")}</strong>
                </p>
                <ColorPalette
                  value={title_.color}
                  onChange={(color) =>
                    this.updateObj("title", "color", title, color)
                  }
                />
                <p>
                  <strong>{__("Background Color", "zita-blocks")}</strong>
                </p>
                <ColorPicker
                  color={title_.backgroundColor}
                  onChangeComplete={(colorBg) => {
                    let color = `rgba(${colorBg.rgb.r},${colorBg.rgb.g},${colorBg.rgb.b},${colorBg.rgb.a})`;
                    this.updateObj("title", "backgroundColor", title, color);
                  }}
                />
                {/* font weight */}
                <div className="flex-section">
                  <p>{__("Font Weight", "zita-blocks")}</p>
                  <select
                    value={title_.fontWeight}
                    onChange={(e) => {
                      this.updateObj(
                        "title",
                        "fontWeight",
                        title,
                        e.target.value
                      );
                    }}
                  >
                    <option value="400">400</option>
                    <option value="600">600</option>
                    <option value="700">700</option>
                  </select>
                </div>
                {/* font weight */}
                <p>
                  <strong>{__("Max Width %", "zita-blocks")}</strong>
                </p>
                <RangeControl
                  value={title_.width}
                  min={1}
                  max={100}
                  onChange={(e) => {
                    this.updateObj("title", "width", title, e);
                  }}
                />
              </>
            )}
          </PanelBody>
          <PanelBody
            title={__("Post Slider Setting", "zita-blocks")}
            initialOpen={false}
          >
            <p>
              <strong>{__("Number Of Post Display", "zita-blocks")}</strong>
            </p>
            <RangeControl
              value={numberOfPosts}
              min={2}
              max={20}
              onChange={(e) => {
                setAttributes({ numberOfPosts: e });
                console.log("ee", e);
                filterPostInit(this, { numberOfPosts: e, featured_image: 1 });
              }}
            />
            <p>
              <strong>{__("Image Overlay Color", "zita-blocks")}</strong>
            </p>
            <ColorPicker
              color={sliderSetting.overlayColor}
              onChangeComplete={(colorBg) => {
                let color = `rgba(${colorBg.rgb.r},${colorBg.rgb.g},${colorBg.rgb.b},${colorBg.rgb.a})`;
                this.updateGlobalSlide(color, "overlayColor");
              }}
            />
            <p>
              <strong>{__("Content Alignment", "zita-blocks")}</strong>
            </p>
            <div className="zita-alignment">
              <div>
                <span
                  onClick={() => {
                    this.updateGlobalSlide("left", "contentAlign");
                  }}
                  className={`dashicons dashicons-editor-alignleft ${
                    sliderSetting.contentAlign == "left" && "active"
                  }`}
                ></span>
              </div>
              <div>
                <span
                  onClick={() => {
                    this.updateGlobalSlide("center", "contentAlign");
                  }}
                  className={`dashicons dashicons-editor-aligncenter ${
                    sliderSetting.contentAlign == "center" && "active"
                  }`}
                ></span>
              </div>
              <div>
                <span
                  onClick={() => {
                    this.updateGlobalSlide("right", "contentAlign");
                  }}
                  className={`dashicons dashicons-editor-alignright ${
                    sliderSetting.contentAlign == "right" && "active"
                  }`}
                ></span>
              </div>
            </div>
            <p>
              <strong>
                {__("Slider Dimension ", "zita-blocks")}
                <small className="dull_grey">
                  ({__("custom Height", "zita-blocks")}/
                  {__("Width", "zita-blocks")})
                </small>
              </strong>
            </p>
            <ToggleControl
              label={
                sliderSetting.dimension.width
                  ? __("Custom Width", "zita-blocks")
                  : __("Auto Width", "zita-blocks")
              }
              checked={sliderSetting.dimension.width}
              onChange={(e) => {
                this.updateGlobalSlide(e, "dimension", "width");
              }}
            />
            {sliderSetting.dimension.width && (
              <RangeControl
                value={sliderSetting.dimension.custom_width}
                min={200}
                max={1400}
                onChange={(e) =>
                  this.updateGlobalSlide(e, "dimension", "custom_width")
                }
              />
            )}
            <ToggleControl
              label={
                sliderSetting.dimension.height
                  ? __("Custom Height", "zita-blocks")
                  : __("Auto Height", "zita-blocks")
              }
              checked={sliderSetting.dimension.height}
              onChange={(e) => {
                this.updateGlobalSlide(e, "dimension", "height");
              }}
            />
            {sliderSetting.dimension.height && (
              <RangeControl
                value={sliderSetting.dimension.custom_height}
                min={360}
                max={1000}
                onChange={(e) =>
                  this.updateGlobalSlide(e, "dimension", "custom_height")
                }
              />
            )}
            <p className="block-inside">{__("Slider Effect", "zita-blocks")}</p>
            <div class="zita-switcher-button-section">
              <span
                onClick={() =>
                  this.updateGlobalSlide("slideEffect", "sliderEffect")
                }
                className={
                  sliderSetting.sliderEffect == "slideEffect" ? "selected" : ""
                }
              >
                {__("Slide", "zita-blocks")}
              </span>
              <span
                onClick={() =>
                  this.updateGlobalSlide("fadeEffect", "sliderEffect")
                }
                className={
                  sliderSetting.sliderEffect == "fadeEffect" ? "selected" : ""
                }
              >
                {__("Fade", "zita-blocks")}
              </span>
            </div>
            <p className="block-inside">{__("Trigger", "zita-blocks")}</p>
            <div class="zita-switcher-button-section">
              <span
                onClick={() => this.setState({ trigger: "linear" })}
                className={triggerActive == "linear" ? "selected" : ""}
              >
                {__("Linear", "zita-blocks")}
              </span>
              <span
                onClick={() => this.setState({ trigger: "left" })}
                className={triggerActive == "left" ? "selected" : ""}
              >
                {__("Left Right", "zita-blocks")}
              </span>
              <span
                onClick={() => this.setState({ trigger: "auto" })}
                className={triggerActive == "auto" ? "selected" : ""}
              >
                {__("Auto", "zita-blocks")}
              </span>
            </div>
            {triggerActive == "linear" && (
              <>
                <ToggleControl
                  label={
                    sliderSetting.linearTrigger.enable
                      ? __("Enable", "zita-blocks")
                      : __("Disable", "zita-blocks")
                  }
                  checked={sliderSetting.linearTrigger.enable}
                  onChange={(e) =>
                    this.updateGlobalSlide(e, "linearTrigger", "enable")
                  }
                />
                <p>
                  <strong>{__("Position", "zita-blocks")}</strong>
                </p>
                <div class="zita-switcher-button-section">
                  <span
                    onClick={() => {
                      this.updateGlobalSlide("in", "linearTrigger", "place");
                    }}
                    className={
                      sliderSetting.linearTrigger.place == "in"
                        ? "selected"
                        : ""
                    }
                  >
                    {__("In", "zita-blocks")}
                  </span>
                  <span
                    onClick={() => {
                      this.updateGlobalSlide("out", "linearTrigger", "place");
                    }}
                    className={
                      sliderSetting.linearTrigger.place == "out"
                        ? "selected"
                        : ""
                    }
                  >
                    {__("Out", "zita-blocks")}
                  </span>
                </div>
                <p>
                  <strong>{__("Trigger Type", "zita-blocks")}</strong>
                </p>
                {sliderSetting.linearTrigger.enable && (
                  <>
                    {/* dk */}
                    <div class="zita-switcher-button-section">
                      <span
                        onClick={() => {
                          this.updateGlobalSlide(
                            "bullet",
                            "linearTrigger",
                            "trigger"
                          );
                        }}
                        className={
                          sliderSetting.linearTrigger.trigger == "bullet"
                            ? "selected"
                            : ""
                        }
                      >
                        {__("Bullets", "zita-blocks")}
                      </span>
                      <span
                        onClick={() => {
                          this.updateGlobalSlide(
                            "thumbnail",
                            "linearTrigger",
                            "trigger"
                          );
                        }}
                        className={
                          sliderSetting.linearTrigger.trigger == "thumbnail"
                            ? "selected"
                            : ""
                        }
                      >
                        {__("Thumbnail", "zita-blocks")}
                      </span>
                    </div>
                    {/* dk */}
                    {sliderSetting.linearTrigger.trigger == "bullet" ? (
                      <>
                        <RangeControl
                          label="Size"
                          value={sliderSetting.linearTrigger.fontSize}
                          min={0}
                          max={70}
                          onChange={(e) =>
                            this.updateGlobalSlide(
                              e,
                              "linearTrigger",
                              "fontSize"
                            )
                          }
                        />
                        <p>
                          <strong>{__("Color", "zita-blocks")}</strong>
                        </p>
                        <ColorPicker
                          color={sliderSetting.linearTrigger.color}
                          onChangeComplete={(colorBg) => {
                            let color = `rgba(${colorBg.rgb.r},${colorBg.rgb.g},${colorBg.rgb.b},${colorBg.rgb.a})`;
                            this.updateGlobalSlide(
                              color,
                              "linearTrigger",
                              "color"
                            );
                          }}
                        />
                        <p>
                          <strong>{__("Active Color", "zita-blocks")}</strong>
                        </p>
                        <ColorPicker
                          color={sliderSetting.linearTrigger.activeColor}
                          onChangeComplete={(colorBg) => {
                            let color = `rgba(${colorBg.rgb.r},${colorBg.rgb.g},${colorBg.rgb.b},${colorBg.rgb.a})`;
                            this.updateGlobalSlide(
                              color,
                              "linearTrigger",
                              "activeColor"
                            );
                          }}
                        />
                      </>
                    ) : (
                      <h1>{__("thumbnail design", "zita-blocks")}</h1>
                    )}
                  </>
                )}
              </>
            )}
            {triggerActive == "left" && (
              <>
                <ToggleControl
                  label={
                    sliderSetting.leftRightTrigger.enable
                      ? __("Enable", "zita-blocks")
                      : __("Disable", "zita-blocks")
                  }
                  checked={sliderSetting.leftRightTrigger.enable}
                  onChange={(e) =>
                    this.updateGlobalSlide(e, "leftRightTrigger", "enable")
                  }
                />
                {sliderSetting.leftRightTrigger.enable && (
                  <>
                    <RangeControl
                      label={__("Font Size", "zita-blocks")}
                      value={sliderSetting.leftRightTrigger.fontSize}
                      min={0}
                      max={70}
                      onChange={(e) =>
                        this.updateGlobalSlide(
                          e,
                          "leftRightTrigger",
                          "fontSize"
                        )
                      }
                    />
                    <p>
                      <strong>{__("Color", "zita-blocks")}</strong>
                    </p>
                    <ColorPalette
                      value={sliderSetting.leftRightTrigger.color}
                      onChange={(color) =>
                        this.updateGlobalSlide(
                          color,
                          "leftRightTrigger",
                          "color"
                        )
                      }
                    />
                    <p>
                      <strong>{__("Background Color", "zita-blocks")}</strong>
                    </p>
                    <ColorPicker
                      color={sliderSetting.leftRightTrigger.backgroundColor}
                      onChangeComplete={(colorBg) => {
                        let color = `rgba(${colorBg.rgb.r},${colorBg.rgb.g},${colorBg.rgb.b},${colorBg.rgb.a})`;
                        this.updateGlobalSlide(
                          color,
                          "leftRightTrigger",
                          "backgroundColor"
                        );
                      }}
                    />
                  </>
                )}
              </>
            )}
            {triggerActive == "auto" && (
              <>
                <ToggleControl
                  label={
                    sliderSetting.autoTrigger.enable
                      ? __("Enable", "zita-blocks")
                      : __("Disable", "zita-blocks")
                  }
                  checked={sliderSetting.autoTrigger.enable}
                  onChange={(e) =>
                    this.updateGlobalSlide(e, "autoTrigger", "enable")
                  }
                />
                {sliderSetting.autoTrigger.enable && (
                  <RangeControl
                    label={__("Slide Delay", "zita-blocks")}
                    value={sliderSetting.autoTrigger.delay}
                    min={0}
                    max={12}
                    onChange={(e) =>
                      this.updateGlobalSlide(e, "autoTrigger", "delay")
                    }
                  />
                )}
              </>
            )}
          </PanelBody>
          <PanelBody
            title={__("Post Title", "zita-blocks")}
            initialOpen={false}
          >
            <p>
              <strong>{__("Post Title Tag", "zita-blocks")}</strong>
            </p>
            <select
              value={heading_.tag}
              className="zita-block-select"
              onChange={(e) => {
                let value_ = e.target.value;
                let font_ =
                  value_ == "h1"
                    ? 30
                    : value_ == "h2"
                    ? 25
                    : value_ == "h3"
                    ? 20
                    : 17;
                let newHeading = [...heading];
                newHeading[0]["tag"] = value_;
                newHeading[0]["fontSize"] = font_;
                setAttributes({ heading: newHeading });
              }}
            >
              <option value="h1">{__("H1", "zita-blocks")}</option>
              <option value="h2">{__("H2", "zita-blocks")}</option>
              <option value="h3">{__("H3", "zita-blocks")}</option>
              <option value="p">{__("P", "zita-blocks")}</option>
            </select>
            <p>
              <strong>{__("Font Size", "zita-blocks")}</strong>
            </p>
            <RangeControl
              value={heading_.fontSize}
              min={1}
              max={50}
              onChange={(e) =>
                this.updateObj("heading", "fontSize", heading, e)
              }
            />
            <p>
              <strong>{__("Color", "zita-blocks")}</strong>
            </p>
            <ColorPalette
              value={heading_.color}
              onChange={(color) =>
                this.updateObj("heading", "color", heading, color)
              }
            />
          </PanelBody>
          <PanelBody title={__("Excerpt", "zita-blocks")} initialOpen={false}>
            <ToggleControl
              label={
                excerpt_.enable
                  ? __("Show", "zita-blocks")
                  : __("Hide", "zita-blocks")
              }
              checked={excerpt_.enable}
              onChange={(e) => this.updateObj("excerpt", "enable", excerpt, e)}
            />
            {excerpt_.enable && (
              <>
                <p>
                  <strong>{__("Number of words", "zita-blocks")}</strong>
                </p>
                <RangeControl
                  value={excerpt_.words}
                  min={1}
                  max={200}
                  onChange={(e) =>
                    this.updateObj("excerpt", "words", excerpt, e)
                  }
                />
                <p>
                  <strong>{__("Font Size", "zita-blocks")}</strong>
                </p>
                <RangeControl
                  value={excerpt_.fontSize}
                  min={1}
                  max={25}
                  onChange={(e) =>
                    this.updateObj("excerpt", "fontSize", excerpt, e)
                  }
                />
                <p>
                  <strong>{__("Color", "zita-blocks")}</strong>
                </p>
                <ColorPalette
                  value={excerpt_.color}
                  onChange={(color) =>
                    this.updateObj("excerpt", "color", excerpt, color)
                  }
                />
              </>
            )}
          </PanelBody>
          <PanelBody title={__("Post Meta", "zita-blocks")} initialOpen={false}>
            <p>
              <strong>{__("Choose Category", "zita-blocks")}</strong>
            </p>
            {cateGory && cateGory.length > 0 ? (
              <div className="zita-multiple-select">
                <SelectControl
                  multiple
                  value={postCategories.length ? postCategories : ["all"]}
                  onChange={(choosen) => {
                    let chooseAll = choosen.filter((choose) => {
                      if (choose == "all") return true;
                    });
                    if (chooseAll.length) choosen = [];
                    setAttributes({ postCategories: choosen });
                    filterPostInit(this, {
                      postCategories: choosen,
                      featured_image: 1,
                    });
                  }}
                  options={cateGory}
                />
              </div>
            ) : (
              <p className="category-blank">
                {__("No Categories Found", "zita-blocks")}
              </p>
            )}

            {/* show author */}
            <ToggleControl
              label={__("Author", "zita-blocks")}
              checked={author_.enable}
              onChange={(e) => this.updateObj("author", "enable", author, e)}
            />
            {/* show date */}
            <ToggleControl
              label={__("Date", "zita-blocks")}
              checked={date_.enable}
              onChange={(e) => this.updateObj("date", "enable", date, e)}
            />
            <ToggleControl
              label={__("Categories", "zita-blocks")}
              checked={showCate_.enable}
              onChange={(e) =>
                this.updateObj("showCate", "enable", showCate, e)
              }
            />
            {/* show last date */}
            <ToggleControl
              label={__("Last Modified Date", "zita-blocks")}
              checked={date_.last_modified}
              onChange={(e) => this.updateObj("date", "last_modified", date, e)}
            />
            <ToggleControl
              label={__("Tag", "zita-blocks")}
              checked={showTag_.enable}
              onChange={(e) => this.updateObj("showTag", "enable", showTag, e)}
            />
            <p class="block-inside">{__("Meta Custom Style", "zita-blocks")}</p>
            <p>
              <strong>{__("Author/Dates Font Size", "zita-blocks")}</strong>
            </p>
            <RangeControl
              value={meta_style_.fontSize}
              min={1}
              max={25}
              onChange={(e) => {
                this.updateObj("meta_style", "fontSize", meta_style, e);
              }}
            />
            <p>
              <strong>{__("Author/Dates Color", "zita-blocks")}</strong>
            </p>
            <ColorPalette
              value={"color" in meta_style_ ? meta_style_.color : ""}
              onChange={(color) =>
                this.updateObj("meta_style", "color", meta_style, color)
              }
            />
            {showCate_.enable && (
              <>
                <p class="block-inside">
                  {__("Category Custom Style", "zita-blocks")}
                </p>
                <p>
                  <strong>
                    {__("Number Category Per Post", "zita-blocks")}
                  </strong>
                </p>
                <RangeControl
                  value={showCate_.count}
                  min={1}
                  max={10}
                  onChange={(e) => {
                    this.updateObj("showCate", "count", showCate, e);
                  }}
                />
                <p>
                  <strong>{__("Font Size", "zita-blocks")}</strong>
                </p>
                <RangeControl
                  value={showCate_.fontSize}
                  min={1}
                  max={30}
                  onChange={(e) => {
                    this.updateObj("showCate", "fontSize", showCate, e);
                  }}
                />
                <ToggleControl
                  label={
                    showCate_.customColor
                      ? __("Custom Style", "zita-blocks")
                      : __("Default Style", "zita-blocks")
                  }
                  checked={showCate_.customColor}
                  onChange={(e) =>
                    this.updateObj("showCate", "customColor", showCate, e)
                  }
                />
                {showCate_.customColor && (
                  <>
                    <p>
                      <strong>{__("Color", "zita-blocks")}</strong>
                    </p>
                    <ColorPalette
                      value={showCate_.color}
                      onChange={(color) =>
                        this.updateObj("showCate", "color", showCate, color)
                      }
                    />
                    <p>
                      <strong>{__("Background Color", "zita-blocks")}</strong>
                    </p>
                    <ColorPicker
                      color={showCate_.backgroundColor}
                      onChangeComplete={(colorBg) => {
                        let color = `rgba(${colorBg.rgb.r},${colorBg.rgb.g},${colorBg.rgb.b},${colorBg.rgb.a})`;
                        this.updateObj(
                          "showCate",
                          "backgroundColor",
                          showCate,
                          color
                        );
                      }}
                    />
                  </>
                )}
              </>
            )}
            {showTag_.enable && (
              <>
                <p class="block-inside">
                  {__("Tags Custom Style", "zita-blocks")}
                </p>
                <p>
                  <strong>{__("Number Tags Per Post", "zita-blocks")}</strong>
                </p>
                <RangeControl
                  value={showTag_.count}
                  min={1}
                  max={10}
                  onChange={(e) => {
                    this.updateObj("showTag", "count", showTag, e);
                  }}
                />
                <p>
                  <strong>{__("Font Size", "zita-blocks")}</strong>
                </p>
                <RangeControl
                  value={showTag_.fontSize}
                  min={1}
                  max={30}
                  onChange={(e) => {
                    this.updateObj("showTag", "fontSize", showTag, e);
                  }}
                />
                <p>
                  <strong>{__("Color", "zita-blocks")}</strong>
                </p>
                <ColorPalette
                  value={showTag_.color}
                  onChange={(color) =>
                    this.updateObj("showTag", "color", showTag, color)
                  }
                />
                <p>
                  <strong>{__("Background Color", "zita-blocks")}</strong>
                </p>
                <ColorPicker
                  color={showTag_.backgroundColor}
                  onChangeComplete={(colorBg) => {
                    let color = `rgba(${colorBg.rgb.r},${colorBg.rgb.g},${colorBg.rgb.b},${colorBg.rgb.a})`;
                    this.updateObj(
                      "showTag",
                      "backgroundColor",
                      showTag,
                      color
                    );
                  }}
                />
              </>
            )}
          </PanelBody>
        </InspectorControls>
        {posts && posts.length > 0 ? (
          <>
            <div className="zita-block-slide-wrapper">
              {title_.enable && (
                <div
                  className="zita-block-post-title"
                  style={{
                    justifyContent: title_.align,
                    borderColor: title_.backgroundColor,
                  }}
                >
                  <RichText
                    key="editable"
                    tagName="h4"
                    placeholder={__("My block title", "zita-blocks")}
                    value={title_.value}
                    style={{
                      fontSize: title_.fontSize + "px",
                      color: title_.color,
                      backgroundColor: title_.backgroundColor,
                      fontWeight: title_.fontWeight,
                      width: title_.width + "%",
                    }}
                    onChange={(e) => this.updateObj("title", "value", title, e)}
                  />
                </div>
              )}
              <div className="zita-slider-bullet">
                <ul className="zita-slider-ul-bullet">
                  {posts.map((val, index_) => {
                    return (
                      <li
                        key={index_}
                        className={slideIndex == index_ ? "selected_" : null}
                      >
                        <span
                          onClick={(e) => {
                            this.setState({ slideIndex: index_ });
                          }}
                        ></span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="zita-slider-container">
                {/* next prev btn */}
                {sliderSetting.leftRightTrigger.enable && (
                  <>
                    <div className="zita-slider-bullet-next-prev next">
                      <span style={leftRightStyle}>
                        <i class="fas fa-arrow-right"></i>
                      </span>
                    </div>
                    <div className="zita-slider-bullet-next-prev prev">
                      <span style={leftRightStyle}>
                        <i class="fas fa-arrow-left"></i>
                      </span>
                    </div>
                  </>
                )}
                {/* next prev btn */}
                <ul className="zita-slider-ul-slides" style={SlideulStyle}>
                  {posts.map((post, slideIndexCu) => {
                    let postAuthor =
                      author_ && author_.enable ? post.author : false;
                    return (
                      <li className={slideIndex == slideIndexCu && "selected_"}>
                        <div class="zita-slider-wrapper">
                          <div class="zita-slider-container">
                            <div class="zita-slider-content-wrapper">
                              <div
                                class="zita-slider-image-container"
                                style={{
                                  backgroundImage:
                                    "url(" + post.feature_image + ")",
                                }}
                              ></div>
                              <div
                                class="zita-slider-text"
                                style={{
                                  backgroundColor: sliderSetting.overlayColor,
                                }}
                              >
                                <div className="slider-post-content">
                                  <div
                                    className={`post-wrapper content-align-${sliderSetting.contentAlign}`}
                                  >
                                    <div className="post-content">
                                      <RichText.Content
                                        className="post-heading"
                                        tagName={heading_.tag}
                                        value={post.postTitle}
                                        style={{
                                          fontSize: heading_.fontSize,
                                          color: heading_.color,
                                        }}
                                      />
                                      {showCate_.enable && (
                                        <p className="post-category">
                                          {showCateFn(
                                            this.props,
                                            post.post_categories,
                                            showCate_
                                          )}
                                        </p>
                                      )}
                                      <div className="post-meta-all">
                                        {postAuthor && (
                                          <p
                                            style={{
                                              color: meta_style_.color,
                                              fontSize:
                                                meta_style_.fontSize + "px",
                                            }}
                                            className="post-author"
                                          >
                                            {postAuthor}
                                          </p>
                                        )}
                                        {date_.enable && (
                                          <>
                                            {postAuthor && (
                                              <span
                                                style={{
                                                  color: meta_style_.color,
                                                  fontSize:
                                                    meta_style_.fontSize + "px",
                                                }}
                                                className="slash"
                                              >
                                                /
                                              </span>
                                            )}
                                            <p
                                              style={{
                                                color: meta_style_.color,
                                                fontSize:
                                                  meta_style_.fontSize + "px",
                                              }}
                                              className="post-date"
                                            >
                                              <span>{post.post_date}</span>
                                            </p>
                                          </>
                                        )}
                                        {date_.last_modified && (
                                          <>
                                            {(postAuthor || date_.enable) && (
                                              <span
                                                style={{
                                                  color: meta_style_.color,
                                                  fontSize:
                                                    meta_style_.fontSize + "px",
                                                }}
                                                className="slash"
                                              >
                                                /
                                              </span>
                                            )}
                                            <p
                                              style={{
                                                color: meta_style_.color,
                                                fontSize:
                                                  meta_style_.fontSize + "px",
                                              }}
                                              className="post-date-last-modified"
                                            >
                                              <span>Modified: </span>
                                              <span>
                                                {post.post_modified_date}
                                              </span>
                                            </p>
                                          </>
                                        )}
                                      </div>
                                      {excerpt_.enable && (
                                        <p
                                          style={{
                                            color: excerpt_.color,
                                            fontSize: excerpt_.fontSize + "px",
                                          }}
                                          className="post-excerpt"
                                        >
                                          {excerptWords(
                                            excerpt_.words,
                                            post.post_excerpt
                                          )}
                                        </p>
                                      )}
                                      {showTag_.enable && (
                                        <p
                                          style={{ color: meta_style_.color }}
                                          className="post-tags"
                                        >
                                          {showTagsFn(post.post_tag, showTag_)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {/* slider trigger */}
                {sliderSetting.linearTrigger.enable && (
                  <ul
                    className={`zita-slider-bullet-trigger thumbnail-image trigger_${sliderSetting.linearTrigger.place}`}
                  >
                    {posts.map((post, index_) => {
                      trigStyle =
                        index_ != slideIndex
                          ? {
                              ...trigStyle,
                              ...{
                                backgroundColor:
                                  sliderSetting.linearTrigger.color,
                              },
                            }
                          : {
                              ...trigStyle,
                              ...{
                                backgroundColor:
                                  sliderSetting.linearTrigger.activeColor,
                              },
                            };
                      return sliderSetting.linearTrigger.trigger ==
                        "thumbnail" ? (
                        <li>
                          <div>
                            <img src={post.getMedia_.guid.rendered} />
                          </div>
                        </li>
                      ) : (
                        <li
                          className={`${
                            index_ == slideIndex ? "selected_" : ""
                          }`}
                        >
                          <span style={trigStyle}></span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </>
        ) : (
          <div>{!posts ? <PostNotfound /> : <PostLoader />}</div>
        )}
      </>
    );
  }
}
export default Edit;
