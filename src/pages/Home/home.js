import React, { useState, useEffect } from "react";
import Input from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import TransactionTable from "../../components/transactionTable/transactionTable";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination/pagination";
import { getBlogsFunc, deleteBlog } from "../requests";
import { Modal } from "../../components/modal/Modal";
import { Notification } from "../../components/notification/Notification";

function Home(props) {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);

  useEffect(() => {
    getBLogs();
  }, [search, currentPage]);

  const getBLogs = async () => {
    setLoading(true);
    let blogs = await getBlogsFunc(`?keyword=${search}&page=${currentPage}`);
    if (blogs) {
      setTotal(blogs.count);
      setBlogs(blogs.results);
    }
    setLoading(false);
  };

  const onDeleteBlog = (slug) => {
    Modal.confirm({
      title: "Delete Confirmation",
      content: "Do you really want to delete this news?",
      onOK: async () => {
        await deleteBlog(slug);
        Notification.bubble({
          type: "success",
          content: "News content successfully deleted",
        });
        getBLogs();
      },
    });
  };

  const getBlogValue = () => {
    const res = [];

    blogs.map((item) => {
      res.push([
        <div style={{ maxWidth: 50 }}>{item.id}</div>,
        <div style={{ minWidth: 300 }}>
          <Link to={`/blog/edit/${item.id}`}>{item.title}</Link>
        </div>,
        <div style={{ maxWidth: 50 }}>{item.comment_count}</div>,
        <div style={{ maxWidth: 150 }} className="flex align-center">
          <Button onClick={() => props.history.push(`/blog/edit/${item.id}`)}>
            Edit
          </Button>
          &nbsp;&nbsp;
          <Button color="danger" onClick={() => onDeleteBlog(item.slug)}>
            Delete
          </Button>
        </div>,
      ]);
      return null;
    });
    return res;
  };

  return (
    <div>
      <h3>All Blogs</h3>
      <div className="flex align-center justify-between">
        <Input
          debounce
          placeholder="search blogs"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          style={{ maxWidth: "300px" }}
        />
        <Link to="/blog/new">
          <Button>ADD BLOG</Button>
        </Link>
      </div>
      <br />
      <TransactionTable
        loading={loading}
        keys={["Id", "News", "Comments", "Actions"]}
        values={getBlogValue()}
      />
      <br />
      {!loading && (
        <>
          <br />
          <Pagination
            total={total}
            current={currentPage}
            onChange={(e) => setCurrentPage(e)}
          />
        </>
      )}
      <br />
      <br />
    </div>
  );
}

export default Home;
