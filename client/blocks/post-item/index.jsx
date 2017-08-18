/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import { getEditorPath } from 'state/ui/editor/selectors';
import { getNormalizedPost } from 'state/posts/selectors';
import { isSharePanelOpen } from 'state/ui/post-type-list/selectors';
import Card from 'components/card';
import PostRelativeTime from 'blocks/post-relative-time';
import PostStatus from 'blocks/post-status';
import PostShare from 'blocks/post-share';
import PostTypeListPostThumbnail from 'my-sites/post-type-list/post-thumbnail';
import PostActionsEllipsisMenu from 'my-sites/post-type-list/post-actions-ellipsis-menu';
import PostTypePostAuthor from 'my-sites/post-type-list/post-type-post-author';

class PostItem extends React.Component {

	static defaultProps = {
		onHeightChange: noop,
	};

	constructor() {
		super( ...arguments );

		this.handleHeightChange = this.handleHeightChange.bind( this );

		this.state = {
			nodeHeight: 0,
		};
	}

	handleHeightChange() {
		if ( window ) {
			setTimeout( () => {
				window.requestAnimationFrame( () => {
					const domNode = findDOMNode( this );
					const nodeHeight = domNode && domNode.clientHeight;

					if ( nodeHeight && nodeHeight !== this.state.nodeHeight ) {
						this.setState( { nodeHeight } );
						this.props.onHeightChange( { nodeHeight, globalId: this.props.globalId } );
					}
				} );
			}, 100 );
		}
	}

	componentDidMount() {
		this.handleHeightChange();
	}

	componentDidUpdate() {
		this.handleHeightChange();
	}

	render() {
		const title = this.props.post ? this.props.post.title : null;
		const classes = classnames( 'post-item', this.props.className, {
			'is-untitled': ! title,
			'is-mini': this.props.compact,
			'is-placeholder': ! this.props.globalId
		} );

		return (
			<div>
				<Card compact className={ classes }>
					<div className="post-item__detail">
						<div className="post-item__title-meta">
							<h1 className="post-item__title">
								<a href={ this.props.editUrl } className="post-item__title-link">
									{ title || this.props.translate( 'Untitled' ) }
								</a>
							</h1>
							<div className="post-item__meta">
								<PostRelativeTime globalId={ this.props.globalId } />
								<PostStatus globalId={ this.props.globalId } />
								<PostTypePostAuthor globalId={ this.props.globalId } />
							</div>
						</div>
					</div>
					<PostTypeListPostThumbnail globalId={ this.props.globalId } />
					<PostActionsEllipsisMenu globalId={ this.props.globalId } />
				</Card>
				{
					this.props.post &&
					this.props.isSharePanelOpen &&
					<PostShare
						post={ this.props.post }
						siteId={ this.props.post.site_ID }
						showClose={ true }
					/>
				}
			</div>
		);
	}
}

PostItem.propTypes = {
	translate: PropTypes.func,
	globalId: PropTypes.string,
	post: PropTypes.object,
	className: PropTypes.string,
	compact: PropTypes.bool,
	onHeightChange: PropTypes.func,
};

export default connect( ( state, { globalId } ) => {
	const post = getNormalizedPost( state, globalId );
	if ( ! post ) {
		return {};
	}

	return {
		post,
		editUrl: getEditorPath( state, post.site_ID, post.ID ),
		isSharePanelOpen: isSharePanelOpen( state, globalId ),
	};
} )( localize( PostItem ) );
