import { Component } from "@wordpress/element";
import { withSelect } from "@wordpress/data";
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
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
  showCateFn = (categories) => {
    let returR = [];
    if ("category" in this.props && this.props.category && categories.length) {
      categories.forEach((cate) => {
        this.props.category.forEach((searchCate) => {
          if (cate == searchCate.id) {
            returR.push(searchCate.name);
            return;
          }
        });
      });
    }
    if (returR.length) {
      return returR.map((returnH) => <span>{returnH}</span>);
    }
  };
  showTagsFn = (tags_) => {
    let returR = [];
    if ("tags" in this.props && this.props.tags && tags_.length) {
      tags_.forEach((tag) => {
        this.props.tags.forEach((searchtag) => {
          if (tag == searchtag.id) {
            returR.push(searchtag.name);
            return;
          }
        });
      });
    }
    if (returR.length) {
      return returR.map((returnH) => <span>{returnH}</span>);
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
    const { posts, attributes, setAttributes, category } = this.props;
    console.log("this.props post block ->", this.props);
    let {
      heading,
      author,
      numberOfPosts,
      thumbnail,
      numberOfColumn,
      columnLayout,
      date,
      showTag,
      showCate,
      excerpt,
      postCategories,
      meta_style,
      title,
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
          <PanelBody title="Post Title" initialOpen={false}>
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
              </>
            )}
          </PanelBody>
          <PanelBody title="Post Layout" initialOpen={false}>
            <p>
              <strong>{__("Layout", "zita-blocks")}</strong>
            </p>
            <select
              value={columnLayout}
              className="zita-block-select"
              onChange={(e) => {
                setAttributes({ columnLayout: e.target.value });
              }}
            >
              <option value="list">{__("List", "zita-blocks")}</option>
              <option value="grid">{__("Grid", "zita-blocks")}</option>
            </select>
            {columnLayout == "grid" && (
              <>
                <p>
                  <strong>{__("Column", "zita-blocks")}</strong>
                </p>
                <RangeControl
                  value={numberOfColumn}
                  min={1}
                  max={4}
                  onChange={(e) => {
                    setAttributes({ numberOfColumn: e });
                  }}
                />
              </>
            )}

            <p>
              <strong>{__("No of Post Display", "zita-blocks")}</strong>
            </p>
            <RangeControl
              value={numberOfPosts}
              min={1}
              max={20}
              onChange={(e) => {
                setAttributes({ numberOfPosts: e });
              }}
            />
            <ToggleControl
              label={__("Left Border", "zita-blocks")}
              checked={meta_style_.left_border}
              onChange={(e) =>
                this.updateObj("meta_style", "left_border", meta_style, e)
              }
            />
          </PanelBody>
          <PanelBody title={__("Heading", "zita-blocks")} initialOpen={false}>
            <p>
              <strong>{__("Heading Tag", "zita-blocks")}</strong>
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
              </>
            )}
            <p>
              <strong>{__("Color", "zita-blocks")}</strong>
            </p>
            <ColorPalette
              value={excerpt_.color}
              onChange={(color) =>
                this.updateObj("excerpt", "color", excerpt, color)
              }
            />
          </PanelBody>
          <PanelBody
            title={__("Featured Image", "zita-blocks")}
            initialOpen={false}
          >
            <select
              value={thumbnail_.typeShow}
              className="zita-block-select"
              onChange={(e) => {
                let value_ = e.target.value;
                this.updateObj("thumbnail", "typeShow", thumbnail, value_);
              }}
            >
              <option value="all">{__("All Post", "zita-blocks")}</option>
              <option value="1">
                {__("Only Featured Image Post", "zita-blocks")}
              </option>
              <option value="2">
                {__("Without Featured Image Post", "zita-blocks")}
              </option>
            </select>

            {/* <ToggleControl
              label={
                thumbnail_.enable
                  ? __("Hide", "zita-blocks")
                  : __("Show", "zita-blocks")
              }
              checked={thumbnail_.enable}
              onChange={(e) =>
                this.updateObj("thumbnail", "enable", thumbnail, e)
              }
            /> */}
            {(thumbnail_.typeShow == "all" || thumbnail_.typeShow == "1") && (
              <>
                <p>
                  <strong>{__("Border Radius", "zita-blocks")}</strong>
                </p>
                <RangeControl
                  value={thumbnail_.borderRadius}
                  min={0}
                  max={80}
                  onChange={(e) =>
                    this.updateObj("thumbnail", "borderRadius", thumbnail, e)
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
            {/* category */}
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
          <div className="zita-block-post">
            {title_.enable && (
              <RichText
                className="zita-block-post-title"
                key="editable"
                tagName="h1"
                placeholder={__("My block title", "zita-blocks")}
                value={title_.value}
                style={{
                  fontSize: title_.fontSize + "px",
                  color: title_.color,
                }}
                onChange={(e) => this.updateObj("title", "value", title, e)}
              />
            )}
            <div
              className={`column-count column-count-${
                columnLayout == "grid" ? numberOfColumn : 1
              } ${meta_style_.left_border && "left-border"}`}
            >
              {posts.map((post) => {
                let postAuthor =
                  author_.enable && "name" in this.authorFn(post.author)
                    ? this.authorFn(post.author).name
                    : false;
                return thumbnail_.typeShow == "1" &&
                  "getMedia_" in post &&
                  post.getMedia_ &&
                  "guid" in post.getMedia_ ? (
                  <article className="block-post-article" key={post.id}>
                    <div className="post-wrapper">
                      <div className="featured-image">
                        <img
                          style={{
                            borderRadius: thumbnail_.borderRadius + "px",
                          }}
                          src={post.getMedia_.guid.rendered}
                        />
                      </div>
                      <div className="post-content">
                        {showCate_.enable && (
                          <p className="post-category">
                            {this.showCateFn(post.categories)}
                          </p>
                        )}
                        <RichText.Content
                          className="post-heading"
                          tagName={heading_.tag}
                          value={__(post.title.rendered, "zita-blocks")}
                          style={{
                            fontSize: heading_.fontSize,
                            color: heading_.color,
                          }}
                        />
                        <div className="post-meta-all">
                          {postAuthor && (
                            <p
                              style={{ color: meta_style_.color }}
                              className="post-author"
                            >
                              {postAuthor}
                            </p>
                          )}
                          {date_.enable && (
                            <>
                              {postAuthor && <span className="slash">/</span>}
                              <p
                                style={{ color: meta_style_.color }}
                                className="post-date"
                              >
                                {this.dateFormate(post.date)}
                              </p>
                            </>
                          )}
                          {date_.last_modified && (
                            <>
                              {(postAuthor || date_.enable) && (
                                <span className="slash">/</span>
                              )}
                              <p
                                style={{ color: meta_style_.color }}
                                className="post-date-last-modified"
                              >
                                <span>Modified: </span>
                                {this.dateFormate(post.modified)}
                              </p>
                            </>
                          )}
                        </div>
                        {excerpt_.enable && (
                          <p
                            style={{ color: excerpt_.color }}
                            className="post-excerpt"
                          >
                            {this.excerptWords(
                              excerpt_.words,
                              post.excerpt.rendered
                            )}
                          </p>
                        )}
                        {showTag_.enable && (
                          <p
                            style={{ color: meta_style_.color }}
                            className="post-tags"
                          >
                            {this.showTagsFn(post.tags)}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                ) : (
                  <article className="block-post-article" key={post.id}>
                    <div className="post-wrapper">
                      {"getMedia_" in post &&
                        post.getMedia_ &&
                        "guid" in post.getMedia_ &&
                        thumbnail_.typeShow == "all" && (
                          <div className="featured-image">
                            <img
                              style={{
                                borderRadius: thumbnail_.borderRadius + "px",
                              }}
                              src={post.getMedia_.guid.rendered}
                            />
                          </div>
                        )}
                      <div className="post-content">
                        {showCate_.enable && (
                          <p className="post-category">
                            {this.showCateFn(post.categories)}
                          </p>
                        )}
                        <RichText.Content
                          className="post-heading"
                          tagName={heading_.tag}
                          value={__(post.title.rendered, "zita-blocks")}
                          style={{
                            fontSize: heading_.fontSize,
                            color: heading_.color,
                          }}
                        />
                        <div className="post-meta-all">
                          {postAuthor && (
                            <p
                              style={{ color: meta_style_.color }}
                              className="post-author"
                            >
                              {postAuthor}
                            </p>
                          )}
                          {date_.enable && (
                            <>
                              {postAuthor && <span className="slash">/</span>}
                              <p
                                style={{ color: meta_style_.color }}
                                className="post-date"
                              >
                                {this.dateFormate(post.date)}
                              </p>
                            </>
                          )}
                          {date_.last_modified && (
                            <>
                              {(postAuthor || date_.enable) && (
                                <span className="slash">/</span>
                              )}
                              <p
                                style={{ color: meta_style_.color }}
                                className="post-date-last-modified"
                              >
                                <span>Modified: </span>
                                {this.dateFormate(post.modified)}
                              </p>
                            </>
                          )}
                        </div>
                        {excerpt_.enable && (
                          <p
                            style={{ color: excerpt_.color }}
                            className="post-excerpt"
                          >
                            {this.excerptWords(
                              excerpt_.words,
                              post.excerpt.rendered
                            )}
                          </p>
                        )}
                        {showTag_.enable && (
                          <p
                            style={{ color: meta_style_.color }}
                            className="post-tags"
                          >
                            {this.showTagsFn(post.tags)}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {!posts
              ? __("No Post Found", "zita-blocks")
              : __("Loding...", "zita-blocks")}
          </div>
        )}
      </>
    );
  }
}
// export default Edit;
export default withSelect((select, props) => {
  const { attributes } = props;
  let { numberOfPosts, postCategories } = attributes;
  const query = { per_page: numberOfPosts };
  if (postCategories && postCategories.length) {
    query["categories"] = postCategories.join(",");
  }
  const { getMedia, getEntityRecords, getAuthors } = select("core");
  let getAllPost = getEntityRecords("postType", "post", query);
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
