/* global $, FontFace, game, mergeObject, ui */

import { CoC7CharacterSheet } from './actor-sheet.js'

export class CoC7CharacterSheetV2 extends CoC7CharacterSheet {
  _getHeaderButtons () {
    if (!this.summarized) this.summarized = false
    let buttons = super._getHeaderButtons()
    buttons = [
      {
        label: this.summarized
          ? game.i18n.localize('CoC7.Maximize')
          : game.i18n.localize('CoC7.Summarize'),
        class: 'test-extra-icon',
        icon: this.summarized
          ? 'fas fa-window-maximize'
          : 'fas fa-window-minimize',
        onclick: event => this.toggleSheetMode(event)
      }
    ].concat(buttons)
    return buttons
  }

  async toggleSheetMode (event) {
    this.summarized = !this.summarized
    await this.close()
    const options = this.summarized
      ? {
          classes: ['coc7', 'actor', 'character', 'summarized'],
          height: 200,
          resizable: false,
          width: 700
        }
      : CoC7CharacterSheetV2.defaultOptions
    await this.render(true, options)
  }

  async getData () {
    const data = await super.getData()
    data.summarized = this.summarized
    data.skillList = []
    let previousSpec = ''
    for (const skill of data.skills) {
      if (skill.data.properties.special) {
        if (previousSpec !== skill.data.specialization) {
          previousSpec = skill.data.specialization
          data.skillList.push({
            isSpecialization: true,
            name: skill.data.specialization
          })
        }
      }
      data.skillList.push(skill)
    }
    data.topSkills = [...data.skills]
      .sort((a, b) => {
        return a.data.value - b.data.value
      })
      .reverse()
      .slice(0, 14)
    data.topWeapons = [...data.meleeWpn, ...data.rangeWpn]
      .sort((a, b) => {
        return a.data.skill.main?.value - b.data.skill.main?.value
      })
      .reverse()
      .slice(0, 3)
    data.displayPlayerName = game.settings.get(
      'CoC7',
      'displayPlayerNameOnSheet'
    )
    if (data.displayPlayerName && !data.data.infos.playername) {
      const user = this.actor.characterUser
      if (user) {
        data.data.infos.playername = user.name
      }
    }
    return data
  }

  /**
   * Extend and override the default options used by the 5e Actor Sheet
   * @returns {Object}
   */
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      classes: ['coc7', 'sheetV2', 'actor', 'character'],
      template: 'systems/CoC7/templates/actors/character/index.html',
      width: 687,
      height: 623,
      resizable: true,
      dragDrop: [{ dragSelector: '.item', dropSelector: null }],
      tabs: [
        {
          navSelector: '.sheet-nav',
          contentSelector: '.sheet-body',
          initial: 'skills'
        }
      ]
    })
  }

  // _onDragStart(event) {
  //   super._onDragStart(event);
  // }

  static renderSheet (sheet) {
    if (game.settings.get('CoC7', 'overrideSheetArtwork')) {
      if (game.settings.get('CoC7', 'artWorkSheetBackground')) {
        sheet.element.css(
          '--main-sheet-bg',
          game.settings.get('CoC7', 'artWorkSheetBackground')
        )
        // const borderImage = sheet.element.find('form').css('border-image');
        // sheet.element.find('form').css('border-image', '');
        if (
          game.settings.get('CoC7', 'artWorkSheetBackgroundType') !== 'slice'
        ) {
          let styleSheet, cssRuleIndex
          for (let i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].href?.endsWith('coc7g.css')) {
              styleSheet = document.styleSheets[i]
              break
            }
          }

          if (styleSheet) {
            for (let i = 0; i < styleSheet.rules.length; i++) {
              if (
                styleSheet.rules[i].selectorText === '.sheetV2.character form'
              ) {
                cssRuleIndex = i
                break
              }
            }
          }
          if (cssRuleIndex) {
            const CSSStyle = styleSheet.rules[cssRuleIndex].style
            CSSStyle.removeProperty('border-image')
            CSSStyle.setProperty(
              'background',
              game.settings.get('CoC7', 'artWorkSheetBackground')
            )
            switch (game.settings.get('CoC7', 'artWorkSheetBackgroundType')) {
              case 'auto':
                CSSStyle.setProperty('background-size', 'auto')
                break
              case 'contain':
                CSSStyle.setProperty('background-size', 'contain')
                break
              case 'cover':
                CSSStyle.setProperty('background-size', 'cover')
                break
              default:
                CSSStyle.setProperty('background-size', 'auto')
                break
            }
          }
        }
      } else if (
        game.settings.get('CoC7', 'artWorkSheetBackground').toLowerCase() ===
        'null'
      ) {
        sheet.element.css(
          '--main-sheet-bg',
          "url( './assets/images/void.webp')"
        )
      }

      if (game.settings.get('CoC7', 'artWorkOtherSheetBackground')) {
        sheet.element.css(
          '--other-sheet-bg',
          game.settings.get('CoC7', 'artWorkOtherSheetBackground')
        )
      } else if (
        game.settings
          .get('CoC7', 'artWorkOtherSheetBackground')
          .toLowerCase() === 'null'
      ) {
        sheet.element.css(
          '--other-sheet-bg',
          "url( './assets/images/void.webp')"
        )
      }

      if (game.settings.get('CoC7', 'artworkSheetImage')) {
        sheet.element.css(
          '--main-sheet-image',
          game.settings.get('CoC7', 'artworkSheetImage')
        )
      } else if (
        game.settings.get('CoC7', 'artworkSheetImage').toLowerCase() === 'null'
      ) {
        sheet.element.css(
          '--main-sheet-image',
          "url( './assets/images/void.webp')"
        )
      }

      if (game.settings.get('CoC7', 'artworkFrontColor')) {
        sheet.element.css(
          '--main-sheet-front-color',
          game.settings.get('CoC7', 'artworkFrontColor')
        )
      }
      if (game.settings.get('CoC7', 'artworkBackgroundColor')) {
        sheet.element.css(
          '--main-sheet-back-color',
          game.settings.get('CoC7', 'artworkBackgroundColor')
        )
      }
      if (game.settings.get('CoC7', 'artworkInteractiveColor')) {
        sheet.element.css(
          '--main-sheet-interactie-color',
          game.settings.get('CoC7', 'artworkInteractiveColor')
        )
      }
      if (!game.settings.get('CoC7', 'artworkFixedSkillLength')) {
        sheet.element.css('--skill-length', 'auto')
        sheet.element.css('--skill-specialization-length', 'auto')
      }

      if (game.settings.get('CoC7', 'artworkMainFont')) {
        const customSheetFont = new FontFace(
          'customSheetFont',
          game.settings.get('CoC7', 'artworkMainFont')
        )
        customSheetFont
          .load()
          .then(function (loadedFace) {
            document.fonts.add(loadedFace)
          })
          .catch(function (error) {
            ui.notifications.error(error)
          })
      }

      if (game.settings.get('CoC7', 'artworkMainFontBold')) {
        const customSheetCursiveFont = new FontFace(
          'customSheetFont',
          game.settings.get('CoC7', 'artworkMainFontBold'),
          { weight: 'bold' }
        )
        customSheetCursiveFont
          .load()
          .then(function (loadedFace) {
            document.fonts.add(loadedFace)
          })
          .catch(function (error) {
            ui.notifications.error(error)
          })
      }

      if (game.settings.get('CoC7', 'artworkMainFontSize')) {
        const size = `${game.settings.get('CoC7', 'artworkMainFontSize')}px`
        if (size !== $(':root').css('font-size')) {
          $(':root').css('font-size', size)
        }
      }
    }
  }
}
