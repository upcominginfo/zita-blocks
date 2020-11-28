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
} from "@wordpress/components";
import { Component } from "@wordpress/element";
let bgImageWrapper = plugin_url.url + "assets/img/image2.jpg";
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSlide: 0,
      twoBtn: "buttoneOne",
      trigger: "linear",
    };
  }
  addSlide = () => {
    let defaultArray = {
      container: {
        bgImage: bgImageWrapper,
        overlayColor: "",
        bgSize: "cover",
      },
      wrapper: {
        bgcolor: "",
        border: "",
        alignment: "left",
        spacing: "2",
      },
      title: {
        text: "This Is Title text",
        fontSize: 17,
        color: "red",
      },
      text: { text: "Add Description", fontSize: 17, color: "red" },
      buttoneOne: {
        enable: true,
        text: "Button One",
        link: "#",
        target: false,
        fontSize: "",
        color: "",
        backgroundColor: "",
        height: "",
        width: "",
        border: false,
        borderColor: "",
        borderWidth: "",
        borderRadius: "",
      },
      buttoneTwo: {
        enable: true,
        text: "Button Two",
        link: "#",
        target: false,
        fontSize: "",
        color: "",
        backgroundColor: "",
        height: "",
        width: "",
        border: false,
        borderColor: "",
        borderWidth: "",
        borderRadius: "",
      },
    };
    let slides_ = this.props.attributes.slides;
    this.props.setAttributes({ slides: [...slides_, defaultArray] });
    this.setState({ selectedSlide: slides_.length });
  };
  removeSlide() {
    let slides_ = this.props.attributes.slides;
    let removeItem = this.state.selectedSlide;
    let afterRemove = [
      ...slides_.slice(0, removeItem),
      ...slides_.slice(removeItem + 1),
    ];
    this.props.setAttributes({ slides: afterRemove });
    this.setState({
      selectedSlide: removeItem - 1 >= 0 ? removeItem - 1 : removeItem,
    });
  }

  updateSlides = (value, for_, type) => {
    let slides_ = this.props.attributes.slides;
    let newSlide = [...slides_];
    newSlide[this.state.selectedSlide][for_][type] = value;
    this.props.setAttributes({ slides: newSlide });
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
    let { slides, sliderSetting } = this.props.attributes;
    const thisState = this.state;
    const stateIndex = thisState.selectedSlide;
    const currentSlide = slides[stateIndex];

    // console.log(slides);
    // console.log(currentSlide);

    const activeTwoBtnState = thisState.twoBtn;
    let triggerActive = thisState.trigger;
    let buttonOneStyle = {
      fontSize: currentSlide.buttoneOne.fontSize,
      color: currentSlide.buttoneOne.color,
      backgroundColor: currentSlide.buttoneOne.backgroundColor,
      paddingTop: currentSlide.buttoneOne.height,
      paddingBottom: currentSlide.buttoneOne.height,
      paddingLeft: currentSlide.buttoneOne.width,
      paddingRight: currentSlide.buttoneOne.width,
    };
    buttonOneStyle = currentSlide.buttoneOne.border
      ? {
          ...{
            borderColor: currentSlide.buttoneOne.borderColor,
            borderWidth: currentSlide.buttoneOne.borderWidth,
            borderRadius: currentSlide.buttoneOne.borderRadius,
            borderStyle: "solid",
          },
          ...buttonOneStyle,
        }
      : buttonOneStyle;
    let buttonTwoStyle = {
      fontSize: currentSlide.buttoneTwo.fontSize,
      color: currentSlide.buttoneTwo.color,
      backgroundColor: currentSlide.buttoneTwo.backgroundColor,
      paddingTop: currentSlide.buttoneTwo.height,
      paddingBottom: currentSlide.buttoneTwo.height,
      paddingLeft: currentSlide.buttoneTwo.width,
      paddingRight: currentSlide.buttoneTwo.width,
    };
    buttonTwoStyle = currentSlide.buttoneTwo.border
      ? {
          ...{
            borderColor: currentSlide.buttoneTwo.borderColor,
            borderWidth: currentSlide.buttoneTwo.borderWidth,
            borderRadius: currentSlide.buttoneTwo.borderRadius,
            borderStyle: "solid",
          },
          ...buttonTwoStyle,
        }
      : buttonTwoStyle;
    sliderSetting = sliderSetting[0];
    let leftRightStyle = {
      color: sliderSetting.leftRightTrigger.color,
      backgroundColor: sliderSetting.leftRightTrigger.backgroundColor,
      fontSize: sliderSetting.leftRightTrigger.fontSize,
    };
    let SlideulStyle = null;
    if (sliderSetting.dimension.height) {
      SlideulStyle = { minHeight: sliderSetting.dimension.custom_height };
    }
    return [
      <InspectorControls>
        <PanelBody title={"Slider Setting"} initialOpen={false}>
          <p className="block-inside">Slider Dimension</p>
          <p>
            <strong>Width</strong>
          </p>
          <ToggleControl
            label={
              sliderSetting.dimension.width ? "Full Width" : "Custom Width"
            }
            checked={sliderSetting.dimension.width}
            onChange={(e) => {
              this.updateGlobalSlide(e, "dimension", "width");
            }}
          />
          {sliderSetting.dimension.width && (
            <RangeControl
              label="Width"
              value={sliderSetting.dimension.custom_width}
              min={200}
              max={1400}
              onChange={(e) =>
                this.updateGlobalSlide(e, "dimension", "custom_width")
              }
            />
          )}
          <p>
            <strong>Height</strong>
          </p>
          <ToggleControl
            label={sliderSetting.dimension.width ? "Auto" : "Custom Height"}
            checked={sliderSetting.dimension.height}
            onChange={(e) => {
              this.updateGlobalSlide(e, "dimension", "height");
            }}
          />
          {sliderSetting.dimension.height && (
            <RangeControl
              label="Height"
              value={sliderSetting.dimension.custom_height}
              min={360}
              max={1000}
              onChange={(e) =>
                this.updateGlobalSlide(e, "dimension", "custom_height")
              }
            />
          )}
          <p className="block-inside">Slider Effect</p>
          <div class="zita-switcher-button-section">
            <span
              onClick={() =>
                this.updateGlobalSlide("slideEffect", "sliderEffect")
              }
              className={
                sliderSetting.sliderEffect == "slideEffect" ? "selected" : ""
              }
            >
              Slide
            </span>
            <span
              onClick={() =>
                this.updateGlobalSlide("fadeEffect", "sliderEffect")
              }
              className={
                sliderSetting.sliderEffect == "fadeEffect" ? "selected" : ""
              }
            >
              Fade
            </span>
          </div>
          <p className="block-inside">Trigger</p>
          <div class="zita-switcher-button-section">
            <span
              onClick={() => this.setState({ trigger: "linear" })}
              className={triggerActive == "linear" ? "selected" : ""}
            >
              Linear
            </span>
            <span
              onClick={() => this.setState({ trigger: "left" })}
              className={triggerActive == "left" ? "selected" : ""}
            >
              Left Right
            </span>
            <span
              onClick={() => this.setState({ trigger: "auto" })}
              className={triggerActive == "auto" ? "selected" : ""}
            >
              Auto
            </span>
          </div>
          {triggerActive == "linear" && (
            <>
              <ToggleControl
                label={
                  sliderSetting.linearTrigger.enable ? "Disable" : "Enable"
                }
                checked={sliderSetting.linearTrigger.enable}
                onChange={(e) =>
                  this.updateGlobalSlide(e, "linearTrigger", "enable")
                }
              />
              {sliderSetting.linearTrigger.enable && (
                <>
                  <RangeControl
                    label="Size"
                    value={sliderSetting.linearTrigger.fontSize}
                    min={0}
                    max={70}
                    onChange={(e) =>
                      this.updateGlobalSlide(e, "linearTrigger", "fontSize")
                    }
                  />
                  <p>
                    <strong>Color</strong>
                  </p>
                  <ColorPicker
                    color={sliderSetting.linearTrigger.color}
                    onChangeComplete={(colorBg) => {
                      let color = `rgba(${colorBg.rgb.r},${colorBg.rgb.g},${colorBg.rgb.b},${colorBg.rgb.a})`;
                      this.updateGlobalSlide(color, "linearTrigger", "color");
                    }}
                  />
                  <p>
                    <strong>Active Color</strong>
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
              )}
            </>
          )}
          {triggerActive == "left" && (
            <>
              <ToggleControl
                label={
                  sliderSetting.leftRightTrigger.enable ? "Disable" : "Enable"
                }
                checked={sliderSetting.leftRightTrigger.enable}
                onChange={(e) =>
                  this.updateGlobalSlide(e, "leftRightTrigger", "enable")
                }
              />
              {sliderSetting.leftRightTrigger.enable && (
                <>
                  <RangeControl
                    label="Font Size"
                    value={sliderSetting.leftRightTrigger.fontSize}
                    min={0}
                    max={70}
                    onChange={(e) =>
                      this.updateGlobalSlide(e, "leftRightTrigger", "fontSize")
                    }
                  />
                  <p>
                    <strong>Color</strong>
                  </p>
                  <ColorPalette
                    value={sliderSetting.leftRightTrigger.color}
                    onChange={(color) =>
                      this.updateGlobalSlide(color, "leftRightTrigger", "color")
                    }
                  />
                  <p>
                    <strong>Background Color</strong>
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
                label={sliderSetting.autoTrigger.enable ? "Disable" : "Enable"}
                checked={sliderSetting.autoTrigger.enable}
                onChange={(e) =>
                  this.updateGlobalSlide(e, "autoTrigger", "enable")
                }
              />
              {sliderSetting.autoTrigger.enable && (
                <RangeControl
                  label="Slide Delay"
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
        <PanelBody title={"Slide Setting"} initialOpen={false}>
          <p>
            <strong>Background image</strong>
          </p>
          <MediaUpload
            allowedType="image"
            onSelect={(newImage) =>
              this.updateSlides(newImage.sizes.full.url, "container", "bgImage")
            }
            value={currentSlide.container.bgImage}
            render={({ open }) => (
              <div onClick={open} className="zita-block-image-uploader">
                <div>
                  <i className="fas fa-plus"></i>
                </div>
                <img src={currentSlide.container.bgImage} />
              </div>
            )}
          />

          <div className="flex-section">
            <p>Background Size</p>
            <select
              value={currentSlide.container.bgSize}
              onChange={(e) => {
                this.updateSlides(e.target.value, "container", "bgSize");
              }}
            >
              <option value="auto">Auto</option>
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </div>
          <p>
            <strong>Overlay Color</strong>
          </p>
          <ColorPicker
            color={currentSlide.container.overlayColor}
            onChangeComplete={(colorBg) => {
              let color = `rgba(${colorBg.rgb.r},${colorBg.rgb.g},${colorBg.rgb.b},${colorBg.rgb.a})`;
              this.updateSlides(color, "container", "overlayColor");
            }}
          />
          <p>
            <strong>Content Alignment</strong>
          </p>
          <div className="zita-alignment">
            <div>
              <span
                onClick={() => {
                  this.updateSlides("left", "wrapper", "alignment");
                }}
                className={`dashicons dashicons-editor-alignleft ${
                  currentSlide.wrapper.alignment == "left" ? "active" : ""
                }`}
              ></span>
            </div>
            <div>
              <span
                onClick={() => {
                  this.updateSlides("center", "wrapper", "alignment");
                }}
                className={`dashicons dashicons-editor-aligncenter ${
                  currentSlide.wrapper.alignment == "center" ? "active" : ""
                }`}
              ></span>
            </div>
            <div>
              <span
                onClick={() => {
                  this.updateSlides("right", "wrapper", "alignment");
                }}
                className={`dashicons dashicons-editor-alignright ${
                  currentSlide.wrapper.alignment == "right" ? "active" : ""
                }`}
              ></span>
            </div>
          </div>
        </PanelBody>
        <PanelBody title={"Text Setting"} initialOpen={false}>
          <p className="block-inside">Header Setting</p>
          <p>
            <strong>Font Size</strong>
          </p>
          <RangeControl
            value={currentSlide.title.fontSize}
            min={0}
            max={100}
            onChange={(e) => this.updateSlides(e, "title", "fontSize")}
          />
          <p>
            <strong>Color</strong>
          </p>
          <ColorPalette
            value={currentSlide.title.color}
            onChange={(color) => this.updateSlides(color, "title", "color")}
          />
          <p className="block-inside">Description Setting</p>
          <p>
            <strong>Font Size</strong>
          </p>
          <RangeControl
            value={currentSlide.text.fontSize}
            min={0}
            max={100}
            onChange={(e) => this.updateSlides(e, "text", "fontSize")}
          />
          <p>
            <strong>Color</strong>
          </p>
          <ColorPalette
            value={currentSlide.text.color}
            onChange={(color) => this.updateSlides(color, "text", "color")}
          />
          <p>
            <strong>Text Vertical Space</strong>
          </p>
          <RangeControl
            value={currentSlide.wrapper.spacing}
            min={0}
            max={30}
            onChange={(e) => this.updateSlides(e, "wrapper", "spacing")}
          />
        </PanelBody>
        <PanelBody title={"Button Setting"} initialOpen={false}>
          <div className="zita-switcher-button-section">
            <span
              className={activeTwoBtnState == "buttoneOne" ? "selected" : ""}
              onClick={() => {
                this.setState({ twoBtn: "buttoneOne" });
              }}
            >
              Button 1
            </span>
            <span
              className={activeTwoBtnState == "buttoneTwo" ? "selected" : ""}
              onClick={() => {
                this.setState({ twoBtn: "buttoneTwo" });
              }}
            >
              Button 2
            </span>
          </div>
          <ToggleControl
            label={
              currentSlide[activeTwoBtnState].enable ? "Disable" : "Enable"
            }
            checked={currentSlide[activeTwoBtnState].enable}
            onChange={(e) => {
              this.updateSlides(e, activeTwoBtnState, "enable");
            }}
          />
          {currentSlide[activeTwoBtnState].enable && (
            <>
              <RangeControl
                label="Font Size"
                value={currentSlide[activeTwoBtnState].fontSize}
                min={0}
                max={70}
                onChange={(e) =>
                  this.updateSlides(e, activeTwoBtnState, "fontSize")
                }
              />
              <p>Color</p>
              <ColorPalette
                value={currentSlide[activeTwoBtnState].color}
                onChange={(color) =>
                  this.updateSlides(color, activeTwoBtnState, "color")
                }
              />
              <p>Background Color</p>
              <ColorPicker
                color={currentSlide[activeTwoBtnState].backgroundColor}
                onChangeComplete={(colorBg) => {
                  let color = `rgba(${colorBg.rgb.r},${colorBg.rgb.g},${colorBg.rgb.b},${colorBg.rgb.a})`;
                  this.updateSlides(
                    color,
                    activeTwoBtnState,
                    "backgroundColor"
                  );
                }}
              />
              <RangeControl
                label="Height"
                value={currentSlide[activeTwoBtnState].height}
                min={0}
                max={30}
                onChange={(e) =>
                  this.updateSlides(e, activeTwoBtnState, "height")
                }
              />
              <RangeControl
                label="Width"
                value={currentSlide[activeTwoBtnState].width}
                min={0}
                max={30}
                onChange={(e) =>
                  this.updateSlides(e, activeTwoBtnState, "width")
                }
              />
              <p>
                <strong>Border</strong>
              </p>
              <ToggleControl
                label={
                  currentSlide[activeTwoBtnState].border ? "Disable" : "Enable"
                }
                checked={currentSlide[activeTwoBtnState].border}
                onChange={(e) =>
                  this.updateSlides(e, activeTwoBtnState, "border")
                }
              />
              {currentSlide[activeTwoBtnState].border && (
                <div className="icon-border-setting">
                  <RangeControl
                    label="Border Width"
                    value={currentSlide[activeTwoBtnState].borderWidth}
                    min={0}
                    max={100}
                    onChange={(e) =>
                      this.updateSlides(e, activeTwoBtnState, "borderWidth")
                    }
                  />
                  <RangeControl
                    label="Border Radius"
                    value={currentSlide[activeTwoBtnState].borderRadius}
                    min={0}
                    max={50}
                    onChange={(e) =>
                      this.updateSlides(e, activeTwoBtnState, "borderRadius")
                    }
                  />
                  <p>Border Color</p>
                  <ColorPalette
                    value={currentSlide[activeTwoBtnState].borderColor}
                    onChange={(color) =>
                      this.updateSlides(color, activeTwoBtnState, "borderColor")
                    }
                  />
                </div>
              )}
            </>
          )}
        </PanelBody>
      </InspectorControls>,
      <div className="zita-block-slide-wrapper">
        <div className="zita-slider-bullet">
          <ul className="zita-slider-ul-bullet">
            {slides.map((val, index_) => {
              return (
                <li
                  key={index_}
                  className={stateIndex == index_ ? "selected_" : null}
                >
                  <span
                    onClick={(e) => {
                      this.setState({ selectedSlide: index_ });
                    }}
                  ></span>
                </li>
              );
            })}
            {slides.length < 8 && (
              <li className="add-item">
                <span
                  onClick={() => {
                    this.addSlide();
                  }}
                >
                  <i className="fas fa-plus"></i>
                </span>
              </li>
            )}
          </ul>
        </div>
        <div className="zita-slider-container">
          {/* slider trigger */}
          {sliderSetting.linearTrigger.enable && (
            <ul className="zita-slider-bullet-trigger">
              {slides.map((val, index_) => {
                let trigStyle = {
                  height: sliderSetting.linearTrigger.fontSize + "px",
                  width: sliderSetting.linearTrigger.fontSize + "px",
                };
                trigStyle =
                  index_ != stateIndex
                    ? {
                        ...trigStyle,
                        ...{
                          backgroundColor: sliderSetting.linearTrigger.color,
                        },
                      }
                    : {
                        ...trigStyle,
                        ...{
                          backgroundColor:
                            sliderSetting.linearTrigger.activeColor,
                        },
                      };
                return (
                  <li className={`${index_ == stateIndex ? "selected_" : ""}`}>
                    <span style={trigStyle}></span>
                  </li>
                );
              })}
            </ul>
          )}
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
          {/* slider trigger */}
          {slides.length > 1 && (
            <span
              className="zita-remove-slide"
              onClick={(e) => {
                this.removeSlide();
              }}
            >
              <i className="fas fa-trash-alt"></i>
            </span>
          )}
          <ul className="zita-slider-ul-slides" style={SlideulStyle}>
            {slides.map((val, index_) => {
              return (
                <li
                  onClick={(e) => {
                    this.setState({ selectedSlide: index_ });
                  }}
                  key={index_}
                  className={stateIndex == index_ ? "selected_" : null}
                >
                  <div className="zita-slider-wrapper">
                    <div className="zita-slider-container">
                      <div className="zita-slider-content-wrapper">
                        <div
                          className="zita-slider-image-container"
                          style={{
                            backgroundSize: val.container.bgSize,
                            backgroundImage:
                              "url(" + val.container.bgImage + ")",
                          }}
                        ></div>
                        <div
                          className={`zita-slider-text ${val.wrapper.alignment}`}
                          style={{
                            backgroundColor: val.container.overlayColor,
                          }}
                        >
                          <div
                            style={{
                              marginTop: val.wrapper.spacing + "px",
                              marginBottom: val.wrapper.spacing + "px",
                            }}
                          >
                            <RichText
                              key="editable"
                              tagName="h1"
                              placeholder="Service Title"
                              value={val.title.text}
                              onChange={(e) =>
                                this.updateSlides(e, "title", "text")
                              }
                              style={{
                                fontSize: val.title.fontSize + "px",
                                color: val.title.color,
                              }}
                            />
                            <RichText
                              key="editable"
                              tagName="h2"
                              placeholder="Service Title"
                              value={val.text.text}
                              onChange={(e) =>
                                this.updateSlides(e, "text", "text")
                              }
                              style={{
                                fontSize: val.text.fontSize + "px",
                                color: val.text.color,
                              }}
                            />
                            <div className="button-container">
                              {val.buttoneOne.enable && (
                                <>
                                  <RichText
                                    key="editable"
                                    tagName="a"
                                    placeholder="Button One"
                                    value={val.buttoneOne.text}
                                    onChange={(e) =>
                                      this.updateSlides(e, "buttoneOne", "text")
                                    }
                                    style={buttonOneStyle}
                                  />
                                </>
                              )}
                              {val.buttoneTwo.enable && (
                                <RichText
                                  key="editable"
                                  tagName="a"
                                  placeholder="Button Two"
                                  value={val.buttoneTwo.text}
                                  onChange={(e) =>
                                    this.updateSlides(e, "buttoneTwo", "text")
                                  }
                                  style={buttonTwoStyle}
                                />
                              )}
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
        </div>
      </div>,
    ];
  }
}
export default Edit;
