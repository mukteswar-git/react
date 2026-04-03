// Children Prop
function ChildrenProp({ children }) {
  return (
    <div className="text-gray-50 max-w-xs rounded-2xl border-2 border-gray-400 bg-gray-900 p-4 hover:bg-gray-800">
      {children}
    </div>
  )
}

export default ChildrenProp;