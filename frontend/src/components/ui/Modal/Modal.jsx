import React from "react";
import { X } from "lucide-react";
export default function Modal({ title, close, children, wide = false }) { return <div className="modal-backdrop"><div className={wide ? "modal wide" : "modal"}><div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={close}><X/></button></div>{children}</div></div>; }
