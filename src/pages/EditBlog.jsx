import BlogForm from '../components/BlogForm';
import { useParams } from 'react-router-dom';

const EditBlog = () => {
    const { id } = useParams();
    return <BlogForm isEditMode={true} blogId={id} />;
};

export default EditBlog;