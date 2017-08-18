/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import Button from 'components/button';
import FormTextInput from 'components/forms/form-text-input';
import PostEditEmbedsStore from 'lib/embeds/store';

// run linter over all files before final commit, b/c ignored some in earlier commits
// add jsdoc to all functions
// add readme to give high-level overview of what it is and how to use it
// add unit tests

class EmbedDialog extends Component {
	static propTypes = {
		isVisible: PropTypes.bool,
		embedUrl: PropTypes.string,
		onInsert: PropTypes.func.required,
	};

	static defaultProps = {
		isVisible: false,
		embedUrl: '',
	};

	state = {
		isVisible: this.props.isVisible,
		embedUrl: this.props.embedUrl,
		embedMarkup: PostEditEmbedsStore.get( this.props.embedUrl ),
	};

	onChangeEmbedUrl = ( event ) => {
		this.setState( {
			embedUrl: event.target.value,
			embedMarkup: PostEditEmbedsStore.get( event.target.value ),
		} );

		// this is breaking. embedurl gets set correctly, but embedmarkup is an empty object
		// maybe need to do something with oncomponentupdate ?

		// re-reder preview - should happen automatically
		// need to debounce or something so not every single second
	};

	onCancel = () => {
		this.setState( { isVisible: false } );
	};

	onUpdate = () => {
		this.props.onInsert( this.state.embedUrl );
		this.setState( { isVisible: false } );

		// if the url changes, the new embedview has a poster that is cropped instead of
	};

	render() {
		return (
			<Dialog
				className="embed-dialog"
				isVisible={ this.state.isVisible }
				onClose={ this.onCancel }
				buttons={ [
					<Button onClick={ this.onCancel }>
						Cancel
					</Button>,
					<Button primary onClick={ this.onUpdate }>
						Update
					</Button>
				] }>
				<h3 className="embed-dialog__title">Embed URL</h3>

				<FormTextInput
					defaultValue={ this.state.embedUrl }
					onChange={ this.onChangeEmbedUrl }
				/>

				<div className="embed-dialog__preview" dangerouslySetInnerHTML={ { __html: this.state.embedMarkup.body } } />
				{/*
				test videos
					https://www.youtube.com/watch?v=R54QEvTyqO4
					https://www.youtube.com/watch?v=ghrL82cc-ss
					https://www.youtube.com/watch?v=JkOIhs2mHpc
					get some others video platforms, and maybe some non-video ones too

				explain why it's safe to use dangersouslysetinnerhtml here. but first verify that it actually is safe
				need to check if embedmarkup.body exists before using it. is there a js equivalent to php's ?? coalecense operator?
				*/}

				{/*
				solved problems below w/ PostEditEmbedStore?
				better way to set the preview content other than dangerouslysetinnerhtml?

				security issue above with src="user input", need to use wpcom oembed provider whitelist.
					lib/embeds/list-store ? seems like it, but verify

				localize strings and test
				*/}
			</Dialog>
		);
	}
}

export default EmbedDialog;
