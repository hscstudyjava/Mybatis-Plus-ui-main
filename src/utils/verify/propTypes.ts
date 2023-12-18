import { type VueTypeValidableDef, type VueTypesInterface, createTypes, toValidableType } from 'vue-types'
import type { CSSProperties } from 'vue'

type PropTypes = VueTypesInterface & {
  readonly style: VueTypeValidableDef<CSSProperties>
}
const newPropTypes = createTypes({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  object: undefined,
  integer: undefined
}) as PropTypes

class propTypes extends newPropTypes {
  // @ts-ignore
  static get style() {
    return toValidableType('style', {
      type: [String, Object]
    })
  }
}

export { propTypes }
