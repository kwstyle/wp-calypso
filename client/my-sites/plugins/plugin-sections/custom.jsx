/**
 * External dependencies
 */
import React from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import NavItem from 'components/section-nav/item';
import NavTabs from 'components/section-nav/tabs';
import SectionNav from 'components/section-nav';
import { sanitizeSectionContent } from 'lib/plugins/utils';

const PluginSectionsCustom = ( { plugin, translate } ) => {
	if ( ! plugin.description.length ) {
		return null;
	}

	const description = sanitizeSectionContent( plugin.description );

	return (
		<div className="plugin-sections__custom plugin-sections">
			<div className="plugin-sections__header">
				<SectionNav selectedText={ translate( 'Description' ) }>
					<NavTabs>
						<NavItem selected>
							{ translate( 'Description' ) }
						</NavItem>
					</NavTabs>
				</SectionNav>
			</div>
			<Card>
				<div
					className="plugin-sections__content"
					dangerouslySetInnerHTML={ { __html: description } } // eslint-disable-line react/no-danger
				/>
			</Card>
		</div>
	);
};

export default localize( PluginSectionsCustom );
