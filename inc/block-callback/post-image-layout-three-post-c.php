<?php
// zita post section callback function
function zita_section_block_three_post($attr)
{
    // echo "<pre>";
    // print_r($attr);
    // echo "</pre>";
    $args = [
        'post_type' => 'post',
        "posts_per_page" => $attr['numberOfPosts'],
        "meta_key" => '_thumbnail_id'
    ];
    if (is_array($attr["postCategories"])  && !empty($attr["postCategories"])) {
        $args['category__in'] = $attr["postCategories"];
    }
    $query = new WP_Query($args);

    $currentPage = $postSetting = "";
    $totalPosts = $query->found_posts;
    $pagesOfPost = ceil($totalPosts / $attr['numberOfPosts']);
    $currentPage = json_encode(array("current" => 1, "total" => $pagesOfPost));
    $postSetting = json_encode($attr);

    if ($query->have_posts()) {
        $postAuthor = isset($attr['author'][0]['enable']) && $attr['author'][0]['enable']  ? true : false;
        $postAuthor2 = isset($attr['author2'][0]['enable']) && $attr['author2'][0]['enable']  ? true : false;
        $postDate = isset($attr['date'][0]['enable']) && $attr['date'][0]['enable']  ? true : false;
        $postDate2 = isset($attr['date2'][0]['enable']) && $attr['date2'][0]['enable']  ? true : false;
        $postDateModify = isset($attr['date'][0]['last_modified']) && $attr['date'][0]['last_modified']  ? true : false;
        $postDateModify2 = isset($attr['date2'][0]['last_modified']) && $attr['date2'][0]['last_modified']  ? true : false;
        $postExcerpt = isset($attr['excerpt'][0]['enable']) && $attr['excerpt'][0]['enable']  ? true : false;
        $postExcerptColor = $postExcerpt && $attr['excerpt'][0]['color'] ? $attr['excerpt'][0]['color'] : "";
        $postExcerpt2 = isset($attr['excerpt2'][0]['enable']) && $attr['excerpt2'][0]['enable']  ? true : false;
        $postExcerpt2Color = $postExcerpt2 && $attr['excerpt2'][0]['color'] ? $attr['excerpt2'][0]['color'] : "";
        $postHtml = "<div class='zita-section-post zita-three-post-section zita-image-section' id='zita-section-post'>";
        // loader
        $postHtml .= "<div class='zita-block-loader linear-bubble'>";
        $postHtml .= "<div><span></span></div>";
        $postHtml .= "</div>";
        // loader
        // post title
        if (isset($attr['title'][0]['enable']) && $attr['title'][0]['enable']) {
            $titleHeadingStyle = "style='background-color:" . $attr['title'][0]['backgroundColor'] . ";color:" . $attr['title'][0]['color'] . ";font-size:" . $attr['title'][0]['fontSize'] . "px;font-weight:" . $attr['title'][0]['fontWeight'] . ";'";
            $postHtml .= '<div style="justify-content:' . $attr['title'][0]['align'] . ';border-color:' . $attr['title'][0]['backgroundColor'] . ';" class="zita-block-post-title" id="zita-block-post-title">';
            $postHtml .= '<h4 ' . $titleHeadingStyle . ' >';
            $postHtml .= $attr['title'][0]['value'];
            $postHtml .= '</h4>';
            $postHtml .= "</div>";
        }
        $postHtml .= "<div class='parent-column-two count-3 post-three-layout-" . $attr['layout'][0]['type'] . " content-align-" . $attr['layout'][0]['contentAlign'] . " content-placed-" . $attr['layout'][0]['contentPlace'] . "' data-setting='" . $postSetting . "' data-currentpage='" . $currentPage . "'>";

        if ($attr['layout'][0]['type'] == 3) {
            while ($query->have_posts()) {
                $query->the_post();
                if (get_the_post_thumbnail_url()) {
                    $postHtml .= returnHtmlPost_three_post($attr['showCate'], $attr['heading'], $postAuthor, $attr['meta_style'], $postDate, $postExcerpt, $attr['excerpt'], $postDateModify, $postExcerptColor, $attr['showTag'], $attr["postCategories"], $attr['layout'][0]);
                }
            }
        } else {
            $checkFirst = true;
            $checkForTwo = 1;
            $columnOne = '<div><div class="column-count column-count-1">';
            $columnTwo = '<div><div class="column-count column-count-1">';
            while ($query->have_posts()) {
                $query->the_post();
                if ($attr['layout'][0]['type'] == 2) {
                    if ($checkForTwo <= 2) {
                        $checkForTwo++;
                        $columnOne .= returnHtmlPost_three_post($attr['showCate'], $attr['heading'], $postAuthor, $attr['meta_style'], $postDate, $postExcerpt,  $attr['excerpt'], $postDateModify, $postExcerptColor, $attr['showTag'], $attr["postCategories"], $attr['layout'][0]);
                    } else {
                        $columnTwo .= returnHtmlPost_three_post($attr['showCate2'], $attr['heading2'], $postAuthor2, $attr['meta_style'], $postDate2, $postExcerpt2,  $attr['excerpt2'], $postDateModify2, $postExcerpt2Color, $attr['showTag2'], $attr["postCategories"], $attr['layout'][0]);
                    }
                } else {
                    if ($checkFirst) {
                        $checkFirst = false;
                        $columnOne .= returnHtmlPost_three_post($attr['showCate'], $attr['heading'], $postAuthor, $attr['meta_style'], $postDate, $postExcerpt,  $attr['excerpt'], $postDateModify, $postExcerptColor, $attr['showTag'], $attr["postCategories"], $attr['layout'][0]);
                    } else {
                        $columnTwo .= returnHtmlPost_three_post($attr['showCate2'], $attr['heading2'], $postAuthor2, $attr['meta_style'], $postDate2, $postExcerpt2,  $attr['excerpt2'], $postDateModify2, $postExcerpt2Color, $attr['showTag2'], $attr["postCategories"], $attr['layout'][0]);
                    }
                }
            }
            $columnOne .= "</div></div>";
            $columnTwo .= "</div></div>";
            $postHtml .= $columnOne;
            $postHtml .= $columnTwo;
        }
        $postHtml .= '</div>';
        if ($attr['meta_style'][0]['npEnable']) {
            $keepDisable = $totalPosts <= $attr['numberOfPosts'] ? "disable" : '';
            $nextPrevStyle = "font-size:" . $attr['meta_style'][0]['npBgfontSize'] . "px;color:" . $attr['meta_style'][0]['npColor'] . ";background-color:" . $attr['meta_style'][0]['npBgColor'] . ";";
            $postHtml .= "<div class='zita-two-post-wrapper-next-prev " . $keepDisable . "'>
                            <div data-section='three-post' style='" . $nextPrevStyle . "' class='zita-image-section-np disable prev'>
                                <i class='fas fa-chevron-left'></i>
                            </div>
                            <div data-section='three-post' style='" . $nextPrevStyle . "' class='zita-image-section-np next'>
                                <i class='fas fa-chevron-right'></i>
                            </div>
                        </div>";
        }

        $postHtml .= '</div>';

        wp_reset_postdata();
        return $postHtml;
    } else {
        return "<div>No post found.</div>";
    }
}

function returnHtmlPost_three_post($cate_, $heading__, $postAuthor, $meta_, $postDate, $postExcerpt, $postExcerpt__, $postDateModify, $postExcerptColor, $tags_, $category__in, $layout_)
{
    $postHtmlCl1 = "<article class='block-post-article'>";
    $postHtmlCl1 .= "<div class='post-wrapper' id='post-wrapper'>";
    $postHtmlCl1 .= '<div class="featured-image">';
    $postHtmlCl1 .= "<a href='" . esc_url(get_the_permalink()) . "'>";
    $postHtmlCl1 .= '<img src="' . get_the_post_thumbnail_url() . '"/>';
    $postHtmlCl1 .= '</a>';
    $postHtmlCl1 .= '</div>';

    $postHtmlCl1 .= "<div class='post-content' style='background-color:" . $layout_['overlayColor'] . ";'>";
    // category
    if ($cate_[0]['enable'] == "true") {
        $postHtmlCl1 .= '<p class="post-category">';
        $category_ = get_the_category();
        $category_ = json_encode($category_);
        $category_ = json_decode($category_, true);
        if (!empty($category_)) {
            $catestyle = 'font-size:' . $cate_[0]['fontSize'] . 'px;';
            if ($cate_[0]['customColor'] == "true") {
                $catestyle .= 'background-color:' . $cate_[0]['backgroundColor'] . ';color:' . $cate_[0]['color'] . ';';
            }
            if (empty($category__in)) {
                foreach ($category__in as $newArraycate) {
                    foreach ($category_ as $cateKKey => $cateValue_) {
                        if ($newArraycate == $cateValue_['term_id']) {
                            unset($category_[$cateKKey]);
                            array_unshift($category_, ['name' => $cateValue_['name'], 'term_id' => $cateValue_['term_id']]);
                        }
                    }
                }
            }
            $countCate = 0;
            foreach ($category_ as $cateValue) {
                if ($cate_[0]['count'] == $countCate) break;
                $postHtmlCl1 .= '<span style="' . $catestyle . '">';
                $postHtmlCl1 .= "<a href='" . get_category_link($cateValue['term_id']) . "'>" . $cateValue['name'] . "</a>";
                $postHtmlCl1 .= '</span>';
                $countCate++;
            }
        }
        $postHtmlCl1 .= '</p>';
    }
    // category
    $postHtmlCl1 .= "<" . $heading__[0]['tag'] . " style='color:" . $heading__[0]['color'] . ";font-size:" . $heading__[0]['fontSize'] . "px;' class='post-heading'>";
    $postHtmlCl1 .= "<a href='" . esc_url(get_the_permalink()) . "'>" . get_the_title() . "</a>";
    $postHtmlCl1 .= "</" . $heading__[0]['tag'] . ">";
    $postHtmlCl1 .= '<div class="post-meta-all">';
    $metaStyle = "color:" . $meta_[0]['color'] . ";font-size:" . $meta_[0]['fontSize'] . "px;";
    if ($postAuthor) {
        $postHtmlCl1 .= "<p style='" . $metaStyle . "' class='post-author'>";
        $postHtmlCl1 .= "<a target='_blank' href='" . get_author_posts_url(get_the_author_meta('ID')) . "'>";
        $postHtmlCl1 .=  get_the_author();
        $postHtmlCl1 .= "</a></p>";
    }
    if ($postDate) {
        $postHtmlCl1 .= $postAuthor ? '<span style="' . $metaStyle . '" class="slash">/</span>' : '';
        $dateYear =   get_the_date('Y');
        $dateMonth =   get_the_date('m');
        $dateDay =   get_the_date('j');
        $postHtmlCl1 .= "<p style='" . $metaStyle . "' class='post-date'>";
        $postHtmlCl1 .= "<a target='_blank' href='" . get_day_link($dateYear, $dateMonth, $dateDay) . "'>";
        $postHtmlCl1 .=  get_the_date();
        $postHtmlCl1 .= "</a></p>";
    }
    if ($postDateModify) {
        $postHtmlCl1 .= ($postDate || $postAuthor) ? '<span style="' . $metaStyle . '" class="slash">/</span>' : '';
        $dateYear =   get_the_modified_date('Y');
        $dateMonth =   get_the_modified_date('m');
        $dateDay =   get_the_modified_date('j');
        $postHtmlCl1 .= "<p style='" . $metaStyle . "' class='post-date-last-modified'>";
        $postHtmlCl1 .= "Modified:<a target='_blank' href='" . get_day_link($dateYear, $dateMonth, $dateDay) . "'>";
        $postHtmlCl1 .=  get_the_modified_date();
        $postHtmlCl1 .= "</a></p>";
    }
    $postHtmlCl1 .= '</div>';
    if ($postExcerpt) {
        $postExcerpt = get_the_excerpt();
        $exLength = isset($postExcerpt__[0]['words']) && $postExcerpt__[0]['words']  ? $postExcerpt__[0]['words'] : false;
        if ($exLength) {
            $postExcerpt = explode(" ", $postExcerpt);
            $postExcerpt = array_slice($postExcerpt, 0, $exLength);
            $postExcerpt = implode(" ", $postExcerpt);
        }
        $postHtmlCl1 .= "<p style='color:" . $postExcerptColor . ";font-size:" . $postExcerpt__[0]['fontSize'] . "px;' class='post-excerpt'>";
        $postHtmlCl1 .= $postExcerpt;
        $postHtmlCl1 .= "<a class='read-more' href='" . esc_url(get_the_permalink()) . "'>Read More</a>";
        $postHtmlCl1 .= "</p>";
    }
    // tags
    if (isset($tags_[0]['enable']) && $tags_[0]['enable']  == "true") {
        $tags = get_the_tags(get_the_ID());
        $postHtmlCl1 .= '<p class="post-tags">';
        if (!empty($tags)) {
            $Tagstyle = 'font-size:' . $tags_[0]['fontSize'] . 'px;background-color:' . $tags_[0]['backgroundColor'] . ';color:' . $tags_[0]['color'] . ';';
            $tagCount = 0;
            foreach ($tags as $tagValue) {
                if ($tags_[0]['count'] == $tagCount) break;
                $postHtmlCl1 .= '<span style="' . $Tagstyle . '">';
                $postHtmlCl1 .= "<a href='" . get_category_link($tagValue->term_id) . "'>" . $tagValue->name . "</a>";
                $postHtmlCl1 .= '</span>';
                $tagCount++;
            }
        }
        $postHtmlCl1 .= '</p>';
    }
    // tags
    $postHtmlCl1 .= "</div>";
    $postHtmlCl1 .= "</div>";
    $postHtmlCl1 .= "</article>";
    return $postHtmlCl1;
}