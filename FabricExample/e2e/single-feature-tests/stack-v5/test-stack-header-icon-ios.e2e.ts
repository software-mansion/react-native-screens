import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';

describeIfiOS('Stack Header Icon (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-header-icon-ios',
    );
  });

  it('should display the header with a star sfSymbol icon on the trailing item', async () => {
    await expect(
      element(by.type('UILabel').and(by.text('Header Icons'))),
    ).toExist();
    await expect(
      element(by.type('_UIModernBarButton').and(by.label('favorite'))),
    ).toBeVisible();
  });

  describe('cycling the bar button item icon', () => {
    it('should cycle the item icon through xcasset, imageSource, templateSource and back to sfSymbol', async () => {
      await element(by.id('cycle-item-icon-button')).tap();
      await expect(
        element(by.id('current-item-icon').and(by.text('xcasset'))),
      ).toBeVisible();
      await expect(
        element(by.type('_UIModernBarButton').and(by.label('favorite'))),
      ).not.toExist();

      await element(by.id('cycle-item-icon-button')).tap();
      await expect(
        element(by.id('current-item-icon').and(by.text('imageSource'))),
      ).toBeVisible();
      await expect(
        element(by.type('_UIModernBarButton').and(by.label('favorite'))),
      ).not.toExist();

      await element(by.id('cycle-item-icon-button')).tap();
      await expect(
        element(by.id('current-item-icon').and(by.text('templateSource'))),
      ).toBeVisible();
      await expect(
        element(by.type('_UIModernBarButton').and(by.label('favorite'))),
      ).not.toExist();

      await element(by.id('cycle-item-icon-button')).tap();
      await expect(
        element(by.id('current-item-icon').and(by.text('sfSymbol'))),
      ).toBeVisible();
      await expect(
        element(by.type('_UIModernBarButton').and(by.label('favorite'))),
      ).toBeVisible();
    });
  });

  describe('the header item menu', () => {
    it('should open the menu on long press and show its items with the star icon', async () => {
      await element(by.label('Actions')).atIndex(0).longPress();

      await expect(element(by.text('Toggle 1'))).toBeVisible();
      await expect(element(by.text('Toggle 2'))).toBeVisible();
      await expect(element(by.text('Toggle 3'))).toBeVisible();
      await expect(element(by.text('Submenu'))).toBeVisible();
      await expect(element(by.text('Cycle icons (sfSymbol)'))).toBeVisible();

      await expect(
        element(
          by
            .label('favorite')
            .withAncestor(by.type('_UIContextMenuCellContentView')),
        ).atIndex(0),
      ).toBeVisible();
      await expect(
        element(
          by
            .label('favorite')
            .withAncestor(by.type('_UIContextMenuCellContentView')),
        ).atIndex(1),
      ).toBeVisible();
      await expect(
        element(
          by
            .label('favorite')
            .withAncestor(by.type('_UIContextMenuCellContentView')),
        ).atIndex(2),
      ).toBeVisible();
      await expect(
        element(
          by
            .label('favorite')
            .withAncestor(by.type('_UIContextMenuCellContentView')),
        ).atIndex(3),
      ).toBeVisible();

      await element(by.text('Submenu')).tap();
      await expect(
        element(
          by
            .label('favorite')
            .withAncestor(
              by
                .label('Sub Toggle 1')
                .and(by.type('_UIContextMenuCellContentView')),
            ),
        ),
      ).toBeVisible();

      await element(by.type('_UIContextMenuSubmenuTitleView')).tap();
    });

    it('should cycle the menu icon variant when repeatedly tapping "Cycle icons" inside the menu', async () => {
      await element(by.text('Cycle icons (sfSymbol)')).tap();
      await expect(element(by.text('Cycle icons (xcasset)'))).toBeVisible();

      await element(by.text('Cycle icons (xcasset)')).tap();
      await expect(element(by.text('Cycle icons (imageSource)'))).toBeVisible();
      await expect(
        element(
          by
            .label('favorite')
            .withAncestor(by.type('_UIContextMenuCellContentView')),
        ).atIndex(0),
      ).not.toExist();

      await element(by.text('Cycle icons (imageSource)')).tap();
      await expect(
        element(by.text('Cycle icons (templateSource)')),
      ).toBeVisible();
      await expect(
        element(
          by
            .label('favorite')
            .withAncestor(by.type('_UIContextMenuCellContentView')),
        ).atIndex(0),
      ).not.toExist();

      await element(by.text('Cycle icons (templateSource)')).tap();
      await expect(element(by.text('Cycle icons (sfSymbol)'))).toBeVisible();
      await expect(
        element(
          by
            .label('favorite')
            .withAncestor(by.type('_UIContextMenuCellContentView')),
        ).atIndex(0),
      ).toBeVisible();
    });
  });
});
