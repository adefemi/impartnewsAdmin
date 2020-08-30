import React, { useState, useEffect } from "react";
import Input from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import FormGroup from "../../components/formGroup/formGroup";
import Ckeditor from "../../components/ckeditor/ckeditor";
import { getBlogsFunc, getTagList, createUpdateBlog } from "../requests";
import { genericChangeSingle } from "../../utils/helper";
import { Spinner } from "../../components/spinner/Spinner";
import { primaryColor } from "../../utils/data";
import { Notification } from "../../components/notification/Notification";
import _ from "lodash";
import { FILE_UPLOAD } from "../../utils/urls";

function NewBlog(props) {
  const [loading, setLoading] = useState(props.edit);
  const [blogData, setBlog] = useState({});
  const [tags, setTags] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    if (props.edit) {
      getBLogs();
    }
    getTags();
  }, []);

  const getBLogs = async () => {
    setLoading(true);
    let blog = await getBlogsFunc(`?id=${props.match.params.uuid}`);
    if (blog) {
      blog = blog.results[0];
      setBlog({
        coverUrl: blog.cover,
        content: blog.content,
        title: blog.title,
      });
      setSlug(blog.slug);
      setTags(blog.tags);
    }
    setLoading(false);
  };

  const getTags = async () => {
    let tags = await getTagList();
    if (tags) {
      setTagList(tags.results);
    }
    setFetching(false);
    console.log(tags);
  };

  const checkActive = (item) => {
    return tags.filter((data) => data.title === item.title).length > 0
      ? "active"
      : "";
  };

  const regTag = (item) => {
    if (tags.filter((data) => data.title === item.title).length > 0) {
      setTags(tags.filter((data) => data.title !== item.title));
    } else {
      setTags([...tags, item]);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    var form_data = new FormData();
    var tempData = { ...blogData, tags: JSON.stringify(tags) };

    for (var key in tempData) {
      form_data.append(key, tempData[key]);
    }
    let res = await createUpdateBlog(
      form_data,
      props.edit ? "patch" : "post",
      props.edit && `/${slug}/`
    );
    if (res) {
      Notification.bubble({
        type: "success",
        content: `News content ${
          props.edit ? "updated" : "created"
        } successfully`,
      });
      props.history.push("/");
    }
    console.log(res);
    setSaving(false);
  };

  if (loading) {
    return <Spinner color={primaryColor} />;
  }

  return (
    <div>
      <h3>Add Blog</h3>
      <form onSubmit={submit}>
        <div className="grid grid-2 grid-gap-h-2">
          <FormGroup
            label="Title"
            subLabel={blogData.coverUrl ? "Enter news caption" : ""}
          >
            <Input
              placeholder="Enter blog title"
              name="title"
              onChange={(e) => genericChangeSingle(e, setBlog, blogData)}
              value={blogData.title}
              required
            />
          </FormGroup>
          <FormGroup label="Cover" subLabel={blogData.coverUrl}>
            <input
              type="file"
              placeholder="Choose cover"
              onChange={(e) =>
                setBlog({ ...blogData, cover: e.target.files[0] })
              }
              required={!props.edit}
            />
          </FormGroup>
        </div>

        <div className="info">Content</div>
        <p />
        <p />
        <Ckeditor
          onChange={(e) => setBlog({ ...blogData, content: e })}
          value={blogData.content}
          uploadUrl={FILE_UPLOAD}
        />
        <br />
        <FormGroup label="Choose Tags">
          {fetching ? (
            <Spinner color={primaryColor} />
          ) : (
            tagList.map((item, id) => (
              <div
                className={`tag-buttons ${checkActive(item)}`}
                key="id"
                onClick={() => regTag(item)}
              >
                {item.title}
              </div>
            ))
          )}
        </FormGroup>
        <br />
        <div className="flex justify-end">
          <Button loading={saving} disabled={saving} type="submit">
            {props.edit ? "UPDATE" : "SAVE"}
          </Button>
        </div>
        <br />
        <br />
      </form>
    </div>
  );
}

export default NewBlog;
