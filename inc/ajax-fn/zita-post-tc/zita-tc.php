<?php
function post_tc_block()
{
    $pageNo = $_POST['trigger'] == "next" ? $_POST['page'] + 1 : $_POST['page'] - 1;
    $attr = $_POST['attr'];
    echo "inside ajax->";
    print_r($attr);
    $args = [
        'post_type' => 'post',
        "posts_per_page" => $attr['numberOfPosts'],
        'paged' => $pageNo,
    ];
    if (is_array($attr["postCategories"])  && !empty($attr["postCategories"])) {
        $args['category__in'] = $attr["postCategories"];
    }
    echo post_tc_html($args, $attr) ? post_tc_html($args, $attr) : 0;
    die();
}
add_action('wp_ajax_post_tc_block', "post_tc_block");
add_action('wp_ajax_nopriv_post_tc_block', "post_tc_block");
function post_tc_block_choose_cate()
{
    $attr = $_POST['attr'];
    $args = [
        'post_type' => 'post',
        "posts_per_page" => $attr['numberOfPosts'],
        'paged' => 1,
    ];
    if (is_array($attr["postCategories"])  && !empty($attr["postCategories"])) {
        $args['category__in'] = $attr["postCategories"];
    }
    echo post_tc_html($args, $attr) ? json_encode(post_tc_html($args, $attr, true)) : 0;
    die();
}
add_action('wp_ajax_post_tc_block_choose_cate', "post_tc_block_choose_cate");
add_action('wp_ajax_nopriv_post_tc_block_choose_cate', "post_tc_block_choose_cate");

// return html function
function post_tc_html($args, $attr, $showNextPrev = false)
{
    // echo "inside ajax-- ";
    // echo $attr['thumbnail2'][0]['enable'] ? "no false" : "false";
    // echo "<- thumb";
    // echo 
    // print_r($attr['thumbnail2']);
    $query = new WP_Query($args);
    $postHtml = "<div class='zita-post-two-column column-layout-" . $attr['meta_style'][0]["layoutPostion"] . "'>";
    $postHtmlCl1 = '<div class="column-one">';
    $postHtmlCl2 = '<div class="column-two">';
    if ($query->have_posts()) {
        $postAuthor = $attr['author'][0]['enable'] == "true"  ? true : false;
        $postAuthor2 = $attr['author2'][0]['enable']  == "true" ? true : false;
        $postDate = $attr['date'][0]['enable']  == "true"  ? true : false;
        $postDate2 = $attr['date2'][0]['enable']  == "true" ? true : false;
        $postDateModify = $attr['date'][0]['last_modified']  == "true" ? true : false;
        $postDateModify2 = $attr['date2'][0]['last_modified']  == "true" ? true : false;
        $postExcerpt = $attr['excerpt'][0]['enable']  == "true"  ? true : false;
        $postExcerptColor = $postExcerpt && $attr['excerpt'][0]['color'] ? $attr['excerpt'][0]['color'] : "";
        $postExcerpt2 = $attr['excerpt2'][0]['enable'] == "true"  ? true : false;
        $postExcerpt2Color = $postExcerpt2 && $attr['excerpt2'][0]['color'] ? $attr['excerpt2'][0]['color'] : "";
        $postThumbnail = $attr['thumbnail'][0]['enable'] == 'true'  ? true : false;
        $postThumbnail2 = $attr['thumbnail2'][0]['enable'] == 'true'  ? true : false;
        $metaStyleColor = isset($attr['meta_style'][0]['color']) && $attr['meta_style'][0]['color']  ? $attr['meta_style'][0]['color'] : "";
        $metaStyleFont = isset($attr['meta_style'][0]['fontSize']) && $attr['meta_style'][0]['fontSize']  ? $attr['meta_style'][0]['fontSize'] : "";
        $metaStyleColor2 = isset($attr['meta_style2'][0]['color']) && $attr['meta_style2'][0]['color']  ? $attr['meta_style2'][0]['color'] : "";
        $metaStyleFont2 = isset($attr['meta_style2'][0]['fontSize']) && $attr['meta_style2'][0]['fontSize']  ? $attr['meta_style2'][0]['fontSize'] : "";
        // $metaLeftBorder = isset($attr['meta_style'][0]['left_border']) && $attr['meta_style'][0]['left_border']  ? "left-border" : "";
        $metashowCate = $attr['showCate'][0]['enable']  == "true" ? true : false;
        $metashowCate2 = $attr['showCate2'][0]['enable']  == "true" ? true : false;
        $metashowshowTag = $attr['showTag'][0]['enable']  == "true" ? true : false;

        $checkFirst = true;
        while ($query->have_posts()) {
            $query->the_post();
            if ($checkFirst) {
                $checkFirst = false;
                // $postHtmlCl1 .= returnHtmlPost($attr['showCate'], $attr['heading'], $postAuthor, $attr['meta_style'], $postDate, $postExcerpt, $attr['excerpt'], $postDateModify, $postExcerptColor, $attr['showTag'], $attr["postCategories"]);
                $postHtmlCl1 .= "<article class='block-post-article'>";
                $postHtmlCl1 .= "<div class='post-wrapper' id='post-wrapper'>";
                if ($postThumbnail) {
                    if (get_the_post_thumbnail_url()) {
                        $postThumbRadius = isset($attr['thumbnail'][0]['borderRadius']) && $attr['thumbnail'][0]['borderRadius']  ? $attr['thumbnail'][0]['borderRadius'] : false;
                        $postHtmlCl1 .= '<div class="featured-image">';
                        $postHtmlCl1 .= "<a href='" . esc_url(get_the_permalink()) . "'>";
                        $postHtmlCl1 .= '<img style="border-radius:' . $postThumbRadius . 'px" src="' . get_the_post_thumbnail_url() . '"/>';
                        $postHtmlCl1 .= '</a>';
                        $postHtmlCl1 .= '</div>';
                    }
                }
                $postHtmlCl1 .= "<div class='post-content'>";
                // category
                if ($metashowCate) {
                    $postHtmlCl1 .= '<p class="post-category">';
                    $category_ = get_the_category();
                    $category_ = json_encode($category_);
                    $category_ = json_decode($category_, true);
                    if (!empty($category_)) {
                        $catestyle = 'font-size:' . $attr['showCate'][0]['fontSize'] . 'px;';
                        if ($attr['showCate'][0]['customColor'] == "true") {
                            $catestyle .= 'background-color:' . $attr['showCate'][0]['backgroundColor'] . ';color:' . $attr['showCate'][0]['color'] . ';';
                        }
                        if (isset($attr['postCategories'])) {
                            foreach ($attr['postCategories'] as $newArraycate) {
                                foreach ($category_ as $cateKKey => $cateValue_) {
                                    if ($newArraycate == $cateValue_['term_id']) {
                                        unset($category_[$cateKKey]);
                                        array_unshift($category_, ['name' => $cateValue_['name'], 'term_id' => $cateValue_['term_id']]);
                                    }
                                }
                            }
                        }
                        $countCate = 0;
                        // $termId_ = '';
                        foreach ($category_ as $cateValue) {
                            if ($attr['showCate'][0]['count'] == $countCate) break;
                            // if ($cateValue['term_id'] == $termId_) continue;
                            $postHtmlCl1 .= '<span style="' . $catestyle . '">';
                            $postHtmlCl1 .= "<a href='" . get_category_link($cateValue["term_id"]) . "'>" . $cateValue['name'] . "</a>";
                            $postHtmlCl1 .= '</span>';
                            $countCate++;
                            // $termId_ = $cateValue['term_id'];
                        }
                    }
                    $postHtmlCl1 .= '</p>';
                }
                // category
                $postHtmlCl1 .= "<" . $attr['heading'][0]['tag'] . " style='color:" . $attr['heading'][0]['color'] . ";font-size:" . $attr['heading'][0]['fontSize'] . "px;' class='post-heading'>";
                $postHtmlCl1 .= "<a href='" . esc_url(get_the_permalink()) . "'>" . get_the_title() . "</a>";
                $postHtmlCl1 .= "</" . $attr['heading'][0]['tag'] . ">";


                $postHtmlCl1 .= '<div class="post-meta-all">';
                if ($postAuthor) {
                    $postHtmlCl1 .= "<p style='color:" . $metaStyleColor . ";font-size:" . $metaStyleFont . "px;' class='post-author'>";
                    $postHtmlCl1 .= "<a target='_blank' href='" . get_author_posts_url(get_the_author_meta('ID')) . "'>";
                    $postHtmlCl1 .=  get_the_author();
                    $postHtmlCl1 .= "</a></p>";
                }
                if ($postDate) {
                    $postHtmlCl1 .= $postAuthor ? '<span style="color:' . $metaStyleColor . ';font-size:' . $metaStyleFont . 'px;" class="slash">/</span>' : '';
                    $dateYear =   get_the_date('Y');
                    $dateMonth =   get_the_date('m');
                    $dateDay =   get_the_date('j');
                    $postHtmlCl1 .= "<p style='color:" . $metaStyleColor . ";font-size:" . $metaStyleFont . "px;' class='post-date'>";
                    $postHtmlCl1 .= "<a target='_blank' href='" . get_day_link($dateYear, $dateMonth, $dateDay) . "'>";
                    $postHtmlCl1 .=  get_the_date();
                    $postHtmlCl1 .= "</a></p>";
                }
                if ($postDateModify) {
                    $postHtmlCl1 .= ($postDate || $postAuthor) ? '<span style="color:' . $metaStyleColor . ';font-size:' . $metaStyleFont . 'px;" class="slash">/</span>' : '';
                    $dateYear =   get_the_modified_date('Y');
                    $dateMonth =   get_the_modified_date('m');
                    $dateDay =   get_the_modified_date('j');
                    $postHtmlCl1 .= "<p style='color:" . $metaStyleColor . ";font-size:" . $metaStyleFont . "px;' class='post-date-last-modified'>";
                    $postHtmlCl1 .= "Modified:<a target='_blank' href='" . get_day_link($dateYear, $dateMonth, $dateDay) . "'>";
                    $postHtmlCl1 .=  get_the_modified_date();
                    $postHtmlCl1 .= "</a></p>";
                }
                $postHtmlCl1 .= '</div>';
                if ($postExcerpt) {
                    $postExcerpt = get_the_excerpt();
                    // exerpt length
                    $exLength = isset($attr['excerpt'][0]['words']) && $attr['excerpt'][0]['words']  ? $attr['excerpt'][0]['words'] : false;
                    if ($exLength) {
                        $postExcerpt = explode(" ", $postExcerpt);
                        $postExcerpt = array_slice($postExcerpt, 0, $exLength);
                        $postExcerpt = implode(" ", $postExcerpt);
                    }
                    $postHtmlCl1 .= "<p style='color:" . $postExcerptColor . "' class='post-excerpt'>";
                    $postHtmlCl1 .= $postExcerpt;
                    $postHtmlCl1 .= "<a class='read-more' href='" . esc_url(get_the_permalink()) . "'>Read More</a>";
                    $postHtmlCl1 .= "</p>";
                }
                // tags
                if ($metashowshowTag) {
                    $tags = get_the_tags(get_the_ID());
                    $postHtmlCl1 .= '<p class="post-tags">';
                    if (!empty($tags)) {
                        $Tagstyle = 'font-size:' . $attr['showTag'][0]['fontSize'] . 'px;background-color:' . $attr['showTag'][0]['backgroundColor'] . ';color:' . $attr['showTag'][0]['color'] . ';';
                        $tagCount = 0;
                        foreach ($tags as $tagValue) {
                            if ($attr['showTag'][0]['count'] == $tagCount) break;
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
            } else {
                // $postHtmlCl2 .= returnHtmlPost($attr['showCate2'], $attr['heading2'], $postAuthor2, $attr['meta_style'], $postDate2, $postExcerpt2,  $attr['excerpt2'], $postDateModify2, $postExcerpt2Color, $attr['showTag2'], $attr["postCategories"]);
                $postHtmlCl2 .= "<article class='block-post-article'>";
                $postHtmlCl2 .= "<div class='post-wrapper' id='post-wrapper'>";
                if ($postThumbnail2) {
                    if (get_the_post_thumbnail_url()) {
                        $postThumbRadius = isset($attr['thumbnail2'][0]['borderRadius']) && $attr['thumbnail2'][0]['borderRadius']  ? $attr['thumbnail2'][0]['borderRadius'] : false;
                        $postHtmlCl2 .= '<div class="featured-image">';
                        $postHtmlCl2 .= "<a href='" . esc_url(get_the_permalink()) . "'>";
                        $postHtmlCl2 .= '<img style="border-radius:' . $postThumbRadius . 'px" src="' . get_the_post_thumbnail_url() . '"/>';
                        $postHtmlCl2 .= '</a>';
                        $postHtmlCl2 .= '</div>';
                    }
                }
                $postHtmlCl2 .= "<div class='post-content'>";
                if ($metashowCate2) {
                    $postHtmlCl2 .= '<p class="post-category">';
                    $category_ = get_the_category();
                    $category_ = json_encode($category_);
                    $category_ = json_decode($category_, true);
                    if (!empty($category_)) {
                        $catestyle2 = 'font-size:' . $attr['showCate2'][0]['fontSize'] . 'px;';
                        if ($attr['showCate2'][0]['customColor'] == "true") {
                            $catestyle2 .= 'background-color:' . $attr['showCate2'][0]['backgroundColor'] . ';color:' . $attr['showCate2'][0]['color'] . ';';
                        }
                        if (isset($attr['postCategories'])) {
                            foreach ($attr['postCategories'] as $newArraycate) {
                                foreach ($category_ as $cateValue_) {
                                    if ($newArraycate == $cateValue_['term_id']) {
                                        array_unshift($category_, ['name' => $cateValue_['name'], 'term_id' => $cateValue_['term_id']]);
                                    }
                                }
                            }
                        }
                        $countCate = 0;
                        $termId_ = '';
                        foreach ($category_ as $cateValue) {
                            if ($attr['showCate2'][0]['count'] == $countCate2) break;
                            if ($cateValue['term_id'] == $termId2_) continue;
                            $postHtmlCl2 .= '<span style="' . $catestyle2 . '">';
                            $postHtmlCl2 .= "<a href='" . get_category_link($cateValue["term_id"]) . "'>" . $cateValue['name'] . "</a>";
                            $postHtmlCl2 .= '</span>';
                            $countCate++;
                            $termId_ = $cateValue['term_id'];
                        }
                    }
                    $postHtmlCl2 .= '</p>';
                }
                // category
                $postHtmlCl2 .= "<" . $attr['heading2'][0]['tag'] . " style='color:" . $attr['heading2'][0]['color'] . ";font-size:" . $attr['heading2'][0]['fontSize'] . "px;' class='post-heading'>";
                $postHtmlCl2 .= "<a href='" . esc_url(get_the_permalink()) . "'>" . get_the_title() . "</a>";
                $postHtmlCl2 .= "</" . $attr['heading2'][0]['tag'] . ">";

                $postHtmlCl2 .= '<div class="post-meta-all">';
                if ($postAuthor2) {
                    $postHtmlCl2 .= "<p style='color:" . $metaStyleColor2 . ";font-size:" . $metaStyleFont2 . "px;' class='post-author'>";
                    $postHtmlCl2 .= "<a target='_blank' href='" . get_author_posts_url(get_the_author_meta('ID')) . "'>";
                    $postHtmlCl2 .=  get_the_author();
                    $postHtmlCl2 .= "</a></p>";
                }
                if ($postDate2) {
                    $postHtmlCl2 .= $postAuthor2 ? '<span style="color:' . $metaStyleColor2 . ';font-size:' . $metaStyleFont2 . 'px;" class="slash">/</span>' : '';
                    $dateYear =   get_the_date('Y');
                    $dateMonth =   get_the_date('m');
                    $dateDay =   get_the_date('j');
                    $postHtmlCl2 .= "<p style='color:" . $metaStyleColor2 . ";font-size:" . $metaStyleFont2 . "px;' class='post-date'>";
                    $postHtmlCl2 .= "<a target='_blank' href='" . get_day_link($dateYear, $dateMonth, $dateDay) . "'>";
                    $postHtmlCl2 .=  get_the_date();
                    $postHtmlCl2 .= "</a></p>";
                }
                if ($postDateModify2) {
                    $postHtmlCl2 .= ($postDate2 || $postAuthor2) ? '<span style="color:' . $metaStyleColor2 . ';font-size:' . $metaStyleFont2 . 'px;" class="slash">/</span>' : '';
                    $dateYear =   get_the_modified_date('Y');
                    $dateMonth =   get_the_modified_date('m');
                    $dateDay =   get_the_modified_date('j');
                    $postHtmlCl2 .= "<p style='color:" . $metaStyleColor2 . ";font-size:" . $metaStyleFont2 . "px;' class='post-date-last-modified'>";
                    $postHtmlCl2 .= "Modified:<a target='_blank' href='" . get_day_link($dateYear, $dateMonth, $dateDay) . "'>";
                    $postHtmlCl2 .=  get_the_modified_date();
                    $postHtmlCl2 .= "</a></p>";
                }
                $postHtmlCl2 .= '</div>';
                if ($postExcerpt2) {
                    $postExcerpt2 = get_the_excerpt();
                    // exerpt length
                    $exLength2 = isset($attr['excerpt2'][0]['words']) && $attr['excerpt2'][0]['words']  ? $attr['excerpt2'][0]['words'] : false;
                    if ($exLength2) {
                        $postExcerpt2 = explode(" ", $postExcerpt2);
                        $postExcerpt2 = array_slice($postExcerpt2, 0, $exLength2);
                        $postExcerpt2 = implode(" ", $postExcerpt2);
                    }
                    $postHtmlCl2 .= "<p style='color:" . $postExcerpt2Color . "' class='post-excerpt'>";
                    $postHtmlCl2 .= $postExcerpt2;
                    $postHtmlCl2 .= "<a class='read-more' href='" . esc_url(get_the_permalink()) . "'>Read More</a>";
                    $postHtmlCl2 .= "</p>";
                }
                // tags
                $postHtmlCl2 .= "</div>";
                $postHtmlCl2 .= "</div>";
                $postHtmlCl2 .= "</article>";
            }
        }
        $postHtmlCl1 .=  '</div>';
        $postHtmlCl2 .= '</div>';
        $postHtml .= $postHtmlCl1 . $postHtmlCl2;
        $postHtml .= '</div>';

        // for category click 
        if ($showNextPrev === true) {
            $totalPosts = $query->found_posts;
            $currentPage = null;
            if ($totalPosts > $attr['numberOfPosts']) {
                $pagesOfPost = ceil($totalPosts / $attr['numberOfPosts']);
                $currentPage = json_encode(array("current" => 1, "total" => $pagesOfPost));
            }
            $returnObj = ["nextprev" => $currentPage];
        }
        // echo "</pre>";

        wp_reset_postdata();
        if ($showNextPrev === false) {
            return $postHtml;
        } else {
            $returnObj['html'] = $postHtml;
            return $returnObj;
        }
    }
}
