import { Component } from "@wordpress/element";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import {
  InspectorControls,
  RichText,
  ColorPalette,
} from "@wordpress/block-editor";
import {
  PanelBody,
  RangeControl,
  ToggleControl,
  SelectControl,
  ColorPicker,
} from "@wordpress/components";
import { decodeEntities } from "@wordpress/html-entities";

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metaChoose: "primary",
      excerpt: "primary",
      heading: "primary",
    };
  }
  updateObj = (parent_key, child_key, initialValue, value_) => {
    let newNewValue = [...initialValue];
    newNewValue[0][child_key] = value_;
    let setAttr_ = {};
    setAttr_[parent_key] = newNewValue;
    this.props.setAttributes(setAttr_);
  };
  dateFormate = (date) => {
    let date_ = date.split("T")[0];
    let dateObj = new Date(date_);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let dateArr =
      monthNames[dateObj.getMonth()] +
      " " +
      dateObj.getDate() +
      ", " +
      dateObj.getFullYear();
    return <RichText.Content tag="span" value={dateArr} />;
  };
  excerptWords = (words, words_) => {
    words_ = decodeEntities(words_);
    words_ = words_.replace(/<\/?[^>]+(>|$)/g, "");
    words_ = words_.split(" ");
    words_ = words_.slice(0, words);
    return words_.join(" ");
  };
  showCateFn = (categories, cate_) => {
    let returR = [];
    if ("category" in this.props && this.props.category && categories.length) {
      let countCate = cate_.count;
      let postCate_ = this.props.attributes.postCategories;
      if (postCate_.length) {
        postCate_.map((ev) => {
          let MkInt = parseInt(ev);
          if (categories.includes(MkInt)) categories.unshift(MkInt);
        });
      }
      categories = [...new Set(categories)];
      categories.forEach((cate) => {
        if (returR.length == countCate) {
          return;
        }
        this.props.category.forEach((searchCate) => {
          if (cate == searchCate.id) {
            returR.push(searchCate.name);
            return;
          }
        });
      });
    }
    if (returR.length) {
      let putCateStyle = { fontSize: cate_.fontSize + "px" };
      if (cate_.customColor) {
        putCateStyle["color"] = cate_.color;
        putCateStyle["backgroundColor"] = cate_.backgroundColor;
      }
      return returR.map((returnH) => (
        <span style={putCateStyle}>{returnH}</span>
      ));
    }
  };
  showTagsFn = (tags_, tag_r) => {
    let returR = [];
    if ("tags" in this.props && this.props.tags && tags_.length) {
      let countTag = tag_r.count;
      tags_.forEach((tag) => {
        if (returR.length == countTag) {
          return;
        }
        this.props.tags.forEach((searchtag) => {
          if (tag == searchtag.id) {
            returR.push(searchtag.name);
            return;
          }
        });
      });
    }
    if (returR.length) {
      let putTagStyle = { color: tag_r.color };
      putTagStyle["color"] = tag_r.color;
      putTagStyle["backgroundColor"] = tag_r.backgroundColor;
      putTagStyle["fontSize"] = tag_r.fontSize + "px";
      return returR.map((returnH) => (
        <span style={putTagStyle}>{returnH}</span>
      ));
    }
  };
  // autor
  authorFn = (author) => {
    let retur = {};
    if ("authors" in this.props) {
      this.props.authors.map((authorDetail) => {
        if (authorDetail.id == author) {
          retur = authorDetail;
          return;
        }
      });
    }
    return retur;
  };
  render() {
    // ++++++++++++++===============

    const { posts, attributes, setAttributes, category } = this.props;
    // console.log("this.props", this.props);
    // if number of post sum
    if (numberOfPosts == 3 || numberOfPosts == 5) {
      this.setState({
        metaChoose: "primary",
        excerpt: "primary",
        heading: "primary",
      });
    }
    // if number of post sum

    let {
      heading,
      author,
      numberOfPosts,
      thumbnail,
      date,
      showTag,
      showCate,
      excerpt,
      postCategories,
      meta_style,
      title,
      layout,
    } = attributes;
    let heading_ = heading[0];
    let thumbnail_ = thumbnail[0];
    let excerpt_ = excerpt[0];
    let date_ = date[0];
    let author_ = author[0];
    let meta_style_ = meta_style[0];
    let title_ = title[0];
    let showTag_ = showTag[0];
    let showCate_ = showCate[0];
    let layout_ = layout[0];
    // category init
    let cateGory = [{ value: "all", label: "All" }];
    if (category && category.length) {
      category.map((catt) => {
        cateGory.push({
          value: catt.id,
          label: catt.name,
        });
      });
    }
    return (
      <>
        <InspectorControls>
          <PanelBody title="Block Title" initialOpen={false}>
            <ToggleControl
              label={
                title_.enable
                  ? __("Show", "zita-blocks")
                  : __("Hide", "zita-blocks")
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
                  <p>Font Weight</p>
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
            title={__("Post Layout", "zita-blocks")}
            initialOpen={false}
          >
            <p>
              <strong>{__("Content Alignment", "zita-blocks")}</strong>
            </p>
            <div class="zita-switcher-button-section">
              <span
                onClick={() =>
                  this.updateObj(
                    "layout",
                    "contentAlign",
                    layout,
                    "bottom-left"
                  )
                }
                className={
                  layout_.contentAlign == "bottom-left" ? "selected" : ""
                }
              >
                {__("Bottom Left", "zita-blocks")}
              </span>
              <span
                onClick={() =>
                  this.updateObj(
                    "layout",
                    "contentAlign",
                    layout,
                    "bottom-center"
                  )
                }
                className={
                  layout_.contentAlign == "bottom-center" ? "selected" : ""
                }
              >
                {__("Bottom Center", "zita-blocks")}
              </span>
            </div>
            <div class="zita-switcher-button-section">
              <span
                onClick={() =>
                  this.updateObj(
                    "layout",
                    "contentAlign",
                    layout,
                    "bottom-right"
                  )
                }
                className={
                  layout_.contentAlign == "bottom-right" ? "selected" : ""
                }
              >
                {__("Bottom Right", "zita-blocks")}
              </span>
              <span
                onClick={() =>
                  this.updateObj("layout", "contentAlign", layout, "center")
                }
                className={layout_.contentAlign == "center" ? "selected" : ""}
              >
                {__("Center", "zita-blocks")}
              </span>
            </div>
            <p>
              <strong>{__("Image Overlay Color", "zita-blocks")}</strong>
            </p>
            <ColorPicker
              color={layout_.overlayColor}
              onChangeComplete={(colorBg) => {
                let color = `rgba(${colorBg.rgb.r},${colorBg.rgb.g},${colorBg.rgb.b},${colorBg.rgb.a})`;
                this.updateObj("layout", "overlayColor", layout, color);
              }}
            />
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
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="p">P</option>
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
          <PanelBody
            title={__("Excerpt / Content", "zita-blocks")}
            initialOpen={false}
          >
            <ToggleControl
              label={
                excerpt_.enable
                  ? __("Hide", "zita-blocks")
                  : __("Show", "zita-blocks")
              }
              checked={excerpt_.enable}
              onChange={(e) => this.updateObj("excerpt", "enable", excerpt, e)}
            />
            {excerpt_.enable && (
              <>
                <p>
                  <strong>Font Size</strong>
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
            {/* category */}
            <p>
              <strong>{__("Choose Category", "zita-blocks")}</strong>
            </p>
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
                }}
                options={cateGory}
              />
            </div>
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
            <p>
              <strong>{__("Color", "zita-blocks")}</strong>
            </p>
            <ColorPalette
              value={"color" in meta_style_ ? meta_style_.color : ""}
              onChange={(color) =>
                this.updateObj("meta_style", "color", meta_style, color)
              }
            />
          </PanelBody>
        </InspectorControls>
        {posts && posts.length > 0 && "getMedia_" in posts[0] ? (
          <div className="zita-section-post">
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
            <div className="column-count column-count-2">
              {posts.map((post) => {
                return (
                  "getMedia_" in post &&
                  post.getMedia_ &&
                  "guid" in post.getMedia_ &&
                  this.returnHtml(
                    post,
                    heading_,
                    author_,
                    date_,
                    meta_style_,
                    thumbnail_,
                    showCate_,
                    excerpt_,
                    showTag_,
                    layout_
                  )
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {!posts ? (
              __("No Post Found", "zita-blocks")
            ) : (
              <div className="post-loader">
                <div className="active linear-bubble zita-block-loader">
                  {__("Post Loading...", "zita-blocks")}
                  <div>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    );
    // ++++++++++++++===============
  }
  returnHtml = (
    post,
    heading_,
    author_,
    date_,
    meta_style_,
    thumbnail_,
    showCate_,
    excerpt_,
    showTag_,
    layout_
  ) => {
    let postAuthor =
      author_ && author_.enable && "name" in this.authorFn(post.author)
        ? this.authorFn(post.author).name
        : false;
    let contentStyle =
      layout_.contentAlign == "bottom-left"
        ? { alignItems: "normal" }
        : layout_.contentAlign == "bottom-center"
        ? { alignItems: "center" }
        : layout_.contentAlign == "bottom-right"
        ? { alignItems: "flex-end" }
        : { alignItems: "center", justifyContent: "center" };
    contentStyle = {
      ...contentStyle,
      ...{ backgroundColor: layout_.overlayColor },
    };
    return (
      <article className="block-post-article" key={post.id}>
        <div className="post-wrapper">
          <div className="featured-image">
            <img src={post.getMedia_.guid.rendered} />
          </div>
          <div className="post-content" style={contentStyle}>
            {showCate_ && showCate_.enable && (
              <p className="post-category">
                {this.showCateFn(post.categories, showCate_)}
              </p>
            )}
            <RichText.Content
              className="post-heading"
              tagName={heading_.tag}
              value={post.title.rendered}
              style={{
                fontSize: heading_.fontSize,
                color: heading_.color,
              }}
            />
            <div className="post-meta-all">
              {postAuthor && (
                <p
                  style={{
                    color: meta_style_.color,
                    fontSize: meta_style_.fontSize + "px",
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
                        fontSize: meta_style_.fontSize + "px",
                      }}
                      className="slash"
                    >
                      /
                    </span>
                  )}
                  <p
                    style={{
                      color: meta_style_.color,
                      fontSize: meta_style_.fontSize + "px",
                    }}
                    className="post-date"
                  >
                    {this.dateFormate(post.date)}
                  </p>
                </>
              )}
              {date_.last_modified && (
                <>
                  {(date_.enable || postAuthor) && (
                    <span
                      style={{
                        color: meta_style_.color,
                        fontSize: meta_style_.fontSize + "px",
                      }}
                      className="slash"
                    >
                      /
                    </span>
                  )}
                  <p
                    style={{
                      color: meta_style_.color,
                      fontSize: meta_style_.fontSize + "px",
                    }}
                    className="post-date-last-modified"
                  >
                    <span>Modified: </span>
                    {this.dateFormate(post.modified)}
                  </p>
                </>
              )}
            </div>
            {excerpt_ && excerpt_.enable && (
              <p
                style={{
                  color: excerpt_.color,
                  fontSize: excerpt_.fontSize + "px",
                }}
                className="post-excerpt"
              >
                {this.excerptWords(excerpt_.words, post.excerpt.rendered)}
                <span className="read-more">
                  {__("...Read More", "zita-blocks")}
                </span>
              </p>
            )}
            {showTag_ && showTag_.enable && (
              <p style={{ color: meta_style_.color }} className="post-tags">
                {this.showTagsFn(post.tags, showTag_)}
              </p>
            )}
          </div>
        </div>
      </article>
    );
  };
}
// export default Edit;
export default withSelect((select, props) => {
  const { attributes } = props;
  let { numberOfPosts, postCategories } = attributes;
  const query = { per_page: numberOfPosts };
  const query2 = { per_page: -1 };
  if (postCategories && postCategories.length) {
    let cateCh = postCategories.join(",");
    query["categories"] = cateCh;
    query2["categories"] = cateCh;
  }
  const { getMedia, getEntityRecords, getAuthors } = select("core");
  ////////////////////////////////////////////////////////////////////////////////////////////
  let getTotalPost = getEntityRecords("postType", "post", query2);
  let getAllPost =
    getTotalPost && getTotalPost.length ? returnPostFn(numberOfPosts) : false;
  function returnPostFn(numberOfPosts, check = false) {
    let numberOfposts_ = check ? check : numberOfPosts;
    let new_query = {
      per_page: numberOfposts_,
    };
    if (postCategories && postCategories.length) {
      new_query["categories"] = postCategories.join(",");
    }
    let checkPost = select("core").getEntityRecords(
      "postType",
      "post",
      new_query
    );
    if (checkPost && checkPost instanceof Array && checkPost.length > 0) {
      let newPostArray = checkPost.filter((chv) => chv.featured_media > 0);
      if (
        newPostArray.length == numberOfPosts ||
        getTotalPost.length <= numberOfposts_
      ) {
        return newPostArray;
      } else {
        if (
          newPostArray.length < numberOfPosts &&
          numberOfposts_ <= getTotalPost.length
        ) {
          return returnPostFn(numberOfPosts, numberOfposts_ + 1);
        }
      }
    } else {
      return false;
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
  // let getAllPost = getEntityRecords("postType", "post", query);
  let cate_ = getEntityRecords("taxonomy", "category", { per_page: -1 });
  let tags_ = getEntityRecords("taxonomy", "post_tag", { per_page: -1 });
  let arrayCatePost = { posts: true, category: cate_, tags: tags_ };
  if (getAllPost && getAllPost.length) {
    let returnArray = [];
    getAllPost.map((v, index_) => {
      if (v.featured_media) {
        getAllPost[index_]["getMedia_"] = getMedia(v.featured_media);
      } else {
        getAllPost[index_]["getMedia_"] = false;
      }
      returnArray.push(getAllPost[index_]);
    });
    arrayCatePost["posts"] = returnArray;
  } else if (getAllPost instanceof Array && getAllPost.length == 0) {
    arrayCatePost["posts"] = false;
  }
  // autohrs
  let authors = getAuthors();
  if (authors && authors.length) {
    let authors_ = [];
    authors.map((v) => {
      authors_.push({ id: v.id, name: v.name });
    });
    arrayCatePost["authors"] = authors_;
  }
  return arrayCatePost;
})(Edit);
