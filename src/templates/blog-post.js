/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Link, graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Img from "gatsby-image"
import { RiArrowRightLine, RiArrowLeftLine } from "react-icons/ri"

import Layout from "../components/layout"
import Seo from '../components/seo';
import Video from "../components/video"

const styles = {
  'article blockquote': {
    'background-color': 'cardBg'
  },
  pagination: {
    'a': {
      color: 'muted',
      '&.is-active': {
        color: 'text'
      },
      '&:hover': {
        color: 'text'
      }
    }
  }
}

const Pagination = (props) => (
  <div 
    className="pagination -post"
    sx={styles.pagination}
  >
    <ul>
        {(props.previous && props.previous.frontmatter.template === 'blog-post') && (
          <li>
              <Link to={props.previous.frontmatter.slug} rel="prev">
                <p
                  sx={{
                    color: 'muted'
                  }}
                >
                  <span className="icon -left"><RiArrowLeftLine/></span> Previous</p>
                <span className="page-title">{props.previous.frontmatter.title}</span>
              </Link>
          </li>
        )}
        {(props.next && props.next.frontmatter.template === 'blog-post') && (
          <li>
            <Link to={props.next.frontmatter.slug} rel="next">
              <p
                sx={{
                  color: 'muted'
                }}
              >Next <span className="icon -right"><RiArrowRightLine/></span></p>
              <span className="page-title">{props.next.frontmatter.title}</span>
            </Link>
          </li>
        )}
    </ul>
  </div>
)

const Post = ({ data, pageContext }) => {
  const { mdx } = data // data.mdx holds your post data
  const { frontmatter, body, excerpt } = mdx
  const Image = frontmatter.featuredImage ? frontmatter.featuredImage.childImageSharp.fluid : ""
  const { previous, next } = pageContext
  const { ytVideo } = frontmatter
  let props = {
    previous,
    next
  }

  return (
    <Layout className="page">
      <Seo
        title={frontmatter.title}
        description={frontmatter.description ? frontmatter.description : excerpt}
        article={true}
      />
      <article className="blog-post">
        <header className="featured-banner">
          <section className="article-header">
            <h1>{frontmatter.title}</h1>
          </section>
          { ytVideo ? (
            <Video
              videoSrcURL={ytVideo}
              videoTitle={"Video pro " + frontmatter.title}
              style={{
              }}
            />
          ) : ""}
          {Image ? (
            <Img 
              fluid={Image} 
              objectFit="cover"
              objectPosition="50% 50%"
              alt={frontmatter.title + ' - Featured image'}
              className="featured-image"
            />
          ) : ""}
        </header>
        
        <MDXRenderer className="blog-post-content">{body}</MDXRenderer>
      </article>
      {(previous || next) && (
        <Pagination {...props} />
      )}
    </Layout>
  )
}

export default Post

export const pageQuery = graphql`
  query BlogPostQuery($id: String!) {
    mdx( 
      id: { eq: $id }
    ) {
      id
      excerpt
      body
      frontmatter {
        date(formatString: "HH:mm - YYYY.MM.DD")
        slug
        title
        description
        featuredImage {
          childImageSharp {
            fluid(maxWidth: 1980, maxHeight: 968, quality: 80, srcSetBreakpoints: [350, 700, 1050, 1400]) {
              ...GatsbyImageSharpFluid
              ...GatsbyImageSharpFluidLimitPresentationSize
            }
          }
        }
        ytVideo
      }
    }
  }
`