import React from "react"
import ContentLoader from "react-content-loader"

const OrdersSkeleton = (props: object) => (
  <ContentLoader 
    speed={2}
    width={340}
    style={{ padding: 25}}
    height={205}
    viewBox="0 0 340 205"
    backgroundColor="#f0f0f0"
    foregroundColor="#d1d1d1"
    {...props}
  >
    <rect x="0" y="100" rx="4" ry="4" width="180" height="15" /> 
    <rect x="0" y="75" rx="4" ry="4" width="132" height="20" /> 
    <rect x="0" y="20" rx="6" ry="6" width="82" height="30" /> 
    <rect x="0" y="145" rx="6" ry="6" width="290" height="40" />
  </ContentLoader>
)

export default OrdersSkeleton

