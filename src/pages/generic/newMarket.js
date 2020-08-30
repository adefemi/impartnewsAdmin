import React, { useState, useEffect } from "react";
import Input from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import FormGroup from "../../components/formGroup/formGroup";
import AppIcon from "../../components/icons/Icon";
import FileDragger from "../../components/fileDragger/fileDragger";
import { FILE_UPLOAD } from "../../utils/urls";
import { genericChangeSingle } from "../../utils/helper";
import { Notification } from "../../components/notification/Notification";
import { getMarketting, addUpdateMarketting } from "../requests";
import { Spinner } from "../../components/spinner/Spinner";
import { primaryColor } from "../../utils/data";

function NewMarket(props) {
  const [images, setImages] = useState([]);
  const [data, setData] = useState({});
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleteTrigger, setTrigger] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(props.edit);

  const removeImage = (id) => {
    setFileToDelete(id);
    setTrigger(true);
  };

  useEffect(() => {
    if (props.edit) {
      getActiveItem();
    }
  }, []);

  const getActiveItem = async () => {
    let activeData = await getMarketting(`${props.match.params.uuid}`);
    if (activeData) {
      setData({
        caption: activeData.caption,
        link: activeData.link,
      });
      setImages(
        activeData.banners.map((item, id) => {
          return {
            completed: true,
            started: true,
            src: JSON.parse(item.banner.replace(/'/g, '"')).banner,
            id: -1 * id - 1,
          };
        })
      );
      setFetching(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (images.length < 1) {
      Notification.bubble({
        type: "error",
        content: "You need to provide at least one banner",
      });
      return;
    }
    if (images.filter((item) => !item.completed).length > 0) {
      Notification.bubble({
        type: "error",
        content: "Please wait while image completes uploading",
      });
      return;
    }
    let tempData = data;
    data.banners = images.map((item) => {
      return { banner: item.src };
    });
    setSaving(true);
    let res = await addUpdateMarketting(
      tempData,
      props.edit ? "patch" : "post",
      props.match.params.uuid
    );
    if (res) {
      Notification.bubble({
        type: "success",
        content: "Marketting content saved successfully",
      });
      props.history.push("/marketting");
    }
    setSaving(false);
  };

  if (fetching) {
    return <Spinner color={primaryColor} />;
  }

  return (
    <div>
      <h3>Add Marketting</h3>
      <form onSubmit={submit}>
        <div className="grid grid-2 grid-gap-h-2">
          <FormGroup label="Caption" subLabel="Enter caption if there is">
            <Input
              placeholder=""
              name="caption"
              value={data.caption}
              onChange={(e) => genericChangeSingle(e, setData, data)}
            />
          </FormGroup>
          <FormGroup label="Link" subLabel="Where to redirect to if clicked">
            <Input
              placeholder="eg. https://google.com"
              name="link"
              value={data.link}
              onChange={(e) => genericChangeSingle(e, setData, data)}
            />
          </FormGroup>
        </div>
        <br />
        <FormGroup label="Add banners to be displayed on website">
          <div className="imageList">
            <div className={images.length >= 5 ? " disabled" : ""}>
              <FileDragger
                onChange={setImages}
                uploadUrl={FILE_UPLOAD}
                fileIdToRemove={fileToDelete}
                updateTrigger={() => setTrigger(false)}
                removeTrigger={deleteTrigger}
                deleteUrl={FILE_UPLOAD}
                fileName="file"
                fileList={images}
              >
                <center>
                  Click or Drag Markketting banners (images) here. NB. support
                  only png, jpg and jpeg
                </center>
              </FileDragger>
            </div>

            <div className="imageItems">
              {images.map((item, id) => (
                <ImageHolder
                  imageData={item}
                  key={id}
                  removeImage={removeImage}
                />
              ))}
            </div>
          </div>
        </FormGroup>
        <br />
        <div className="flex justify-end">
          <Button type="submit" loading={saving} disabled={saving}>
            {props.edit ? "UPDATE" : "CREATE"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export const ImageHolder = (props) => {
  return (
    <div className="imageHolder">
      <div
        className="bgMain"
        style={{ backgroundImage: `url('${props.imageData.src}')` }}
      />
      {!props.imageData.completed && (
        <div className="loader">
          <div
            className="inner"
            style={{ width: `${props.imageData.progress}%` }}
          />
        </div>
      )}

      {props.imageData.completed && (
        <span onClick={() => props.removeImage(props.imageData.id)}>
          <AppIcon name="x" type="feather" />
        </span>
      )}
    </div>
  );
};

export default NewMarket;
